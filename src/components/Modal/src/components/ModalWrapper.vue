<template>
  <ScrollContainer ref="wrapperRef">
    <div ref="spinRef" class="spinRefWrapper" :style="spinStyle">
      <slot></slot>
      <div v-if="loading" class="loading-wrapper">
        <Spin :tip="loadingTip" />
      </div>
    </div>
  </ScrollContainer>
</template>
<script lang="ts">
import { Spin } from "ant-design-vue";
import { ScrollContainer } from "@/components/Scrollbar/index";
import { debounce } from "lodash-es";
const props = {
  loading: { type: Boolean },
  useWrapper: { type: Boolean, default: true },
  modalHeaderHeight: { type: Number, default: 57 },
  modalFooterHeight: { type: Number, default: 74 },
  minHeight: { type: Number, default: 200 },
  height: { type: Number },
  footerOffset: { type: Number, default: 0 },
  visible: { type: Boolean },
  fullScreen: { type: Boolean },
  loadingTip: { type: String, default: "正在加载..." },
};

type DataState = {
  realHeightRef: number;
  minRealHeightRef: number;
  observer: MutationObserver | undefined;
  resizeObserver: ResizeObserver | undefined;
};

export default {
  name: "ModalWrapper",
  components: { ScrollContainer, Spin },
  inheritAttrs: false,
  props,
  data(): DataState {
    return {
      realHeightRef: 0,
      minRealHeightRef: 0,
      observer: undefined,
      resizeObserver: undefined,
    };
  },
  computed: {
    spinStyle(): Recordable {
      return {
        minHeight: `${this.minHeight}px`,
        [this.fullScreen ? "height" : "maxHeight"]: `${this.realHeightRef}px`,
      };
    },
  },
  watch: {
    useWrapper(val) {
      this.setModalHeight();
    },
    fullScreen: {
      handler(v) {
        this.setModalHeight();
        if (!v) {
          this.realHeightRef = this.minRealHeightRef;
        } else {
          this.minRealHeightRef = this.realHeightRef;
        }
      },
    },
  },
  mounted() {
    const { modalHeaderHeight, modalFooterHeight } = this;
    this.$emit("ext-height", modalHeaderHeight + modalFooterHeight);
    this.$nextTick(() => {
      this.bodyResizeObserver(
        debounce(() => {
          this.setModalHeight();
        }, 200)
      );
      this.domObserver(this.$refs.spinRef as HTMLElement, () => {
        this.setModalHeight();
      });
    });
  },
  methods: {
    bodyResizeObserver(callback: () => any) {
      const isSupported = () => window && "ResizeObserver" in window;
      if (isSupported() && window) {
        this.resizeObserver = new ResizeObserver(callback);
        this.resizeObserver!.observe(document.body, {});
      }
    },
    domObserver(target: HTMLElement, callback: () => any) {
      const isSupported = () => window && "MutationObserver" in window;

      if (isSupported() && window && target) {
        this.observer = new MutationObserver(callback);
        this.observer.observe(target, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
    },
    redoModalHeight() {
      this.setModalHeight();
    },
    async scrollTop() {
      this.$nextTick(() => {
        const wrapperRefDom = this.$refs.wrapperRef;
        if (!wrapperRefDom) return;
        (wrapperRefDom as any)?.scrollTo?.(0);
      });
    },
    async setModalHeight() {
      // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
      // 加上这个,就必须在使用的时候传递父级的visible
      if (!this.visible) return;

      const wrapperRefDom = this.$refs.wrapperRef;
      if (!wrapperRefDom) return;
      // @ts-ignore
      const bodyDom = wrapperRefDom.$el.parentElement;
      if (!bodyDom) return;
      bodyDom.style.padding = "0";
      await this.$nextTick();

      try {
        const modalDom =
          bodyDom.parentElement && bodyDom.parentElement.parentElement;
        if (!modalDom) return;

        const modalRect = getComputedStyle(modalDom as Element).top;
        const modalTop = Number.parseInt(modalRect);
        let maxHeight =
          window.innerHeight -
          modalTop * 2 +
          (this.footerOffset! || 0) -
          this.modalFooterHeight -
          this.modalHeaderHeight;

        // 距离顶部过进会出现滚动条
        if (modalTop < 40) {
          maxHeight -= 26;
        }
        await this.$nextTick();
        const spinEl = this.$refs.spinRef;

        if (!spinEl) return;
        await this.$nextTick();
        const realHeight = (spinEl as HTMLElement).scrollHeight;

        if (this.fullScreen) {
          this.realHeightRef =
            window.innerHeight -
            this.modalFooterHeight -
            this.modalHeaderHeight -
            28;
        } else {
          this.realHeightRef = this.height
            ? this.height
            : realHeight > maxHeight
            ? maxHeight
            : realHeight;
        }
        this.$emit("height-change", this.realHeightRef);
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  },
};
</script>
<style lang="less" scoped>
.loading-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
