<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
    <template #closeIcon v-if="!$slots.closeIcon">
      <ModalClose
        :canFullscreen="getProps.canFullscreen"
        :fullScreen="fullScreenRef"
        @cancel="handleCancel"
        @fullscreen="handleFullScreen"
      />
    </template>

    <template #title v-if="!$slots.title">
      <ModalHeader
        name="title"
        :helpMessage="getProps.helpMessage"
        :title="getMergeProps.title"
        @dblclick="handleTitleDbClick"
      />
    </template>

    <template #footer v-if="!$slots.footer">
      <ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </ModalFooter>
    </template>

    <ModalWrapper
      :useWrapper="getProps.useWrapper"
      :footerOffset="wrapperFooterOffset"
      :fullScreen="fullScreenRef"
      ref="modalWrapperRef"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :minHeight="getProps.minHeight"
      :height="getWrapperHeight"
      :visible="visibleRef"
      :modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
      v-bind="modalWrapperProps"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot></slot>
    </ModalWrapper>

    <template #[item]="data" v-for="item in modalSlots">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>
<script lang="ts">
import type { ModalProps } from "./typing";
import Modal from "./components/Modal.vue";
import ModalWrapper from "./components/ModalWrapper.vue";
import ModalClose from "./components/ModalClose.vue";
import ModalFooter from "./components/ModalFooter.vue";
import ModalHeader from "./components/ModalHeader.vue";
import { isFunction } from "@/utils/is";
import { deepMerge, useDesign } from "@/utils";
import { basicProps } from "./props";
import { omit } from "lodash-es";

type DataState = {
  propsRef: Partial<ModalProps> | null;
  extHeightRef: number;
  visibleRef: boolean;
  getWrapClassName: string;
  fullScreenRef: boolean;
  prefixCls: string;
};
export default {
  name: "BasicModal",
  components: { Modal, ModalWrapper, ModalClose, ModalFooter, ModalHeader },
  inheritAttrs: false,
  props: basicProps,
  model: {
    prop: "visible",
    event: "update:visible",
  },
  data(): DataState {
    return {
      extHeightRef: 0,
      propsRef: null,
      visibleRef: false,
      getWrapClassName: "",
      fullScreenRef: false,
      prefixCls: "",
    };
  },
  computed: {
    modalSlots() {
      return Object.keys(omit(this.$slots, "default"));
    },
    modalWrapperProps(): Recordable {
      return omit(
        this.getProps.wrapperProps,
        "visible",
        "height",
        "modalFooterHeight"
      );
    },
    getMergeProps(): Recordable {
      return {
        ...(this.$props as Recordable),
        ...(this.propsRef as Recordable),
      };
    },
    getProps(): Recordable {
      const opt = {
        ...this.getMergeProps,
        visible: this.visibleRef,
        okButtonProps: undefined,
        cancelButtonProps: undefined,
        title: undefined,
      };
      return {
        ...opt,
        wrapClassName: this.getWrapClassName,
      };
    },
    getBindValue(): Recordable {
      const attr: Recordable = {
        ...this.$attrs,
        ...this.getMergeProps,
        visible: this.visibleRef,
        wrapClassName: this.getWrapClassName,
      };

      if (this.fullScreenRef) {
        return omit(attr, ["height", "title"]);
      }
      return omit(attr, ["title"]);
    },
    getWrapperHeight(): any {
      if (this.fullScreenRef) return undefined;
      return this.getProps.height;
    },
  },
  watch: {
    visibleRef: {
      handler(v) {
        this.$emit("visible-change", v);
        this.$emit("update:visible", v);
        this.$nextTick(() => {
          if (this.scrollTop && v && this.$refs.modalWrapperRef) {
            // @ts-ignore
            this.$refs.modalWrapperRef.scrollTop();
          }
        });
      },
      immediate: false,
    },
    visible(val) {
      this.visibleRef = !!val;
    },
    defaultFullscreen(val) {
      this.fullScreenRef = !!val;
    },
  },
  created() {
    const { prefixCls } = useDesign("basic-modal");
    this.prefixCls = prefixCls;
  },
  methods: {
    handleFullScreen(e: Event) {
      e && e.stopPropagation();
      this.fullScreenRef = !this.fullScreenRef;
      const clsName = this.wrapClassName || "";
      this.getWrapClassName = this.fullScreenRef
        ? `fullscreen-modal ${clsName} `
        : clsName;
    },
    redoModalHeight() {
      this.$nextTick(() => {
        if (this.$refs.modalWrapperRef) {
          (this.$refs.modalWrapperRef as any)?.setModalHeight();
        }
      });
    },
    // 取消事件
    async handleCancel(e: Event) {
      e?.stopPropagation();
      // 过滤自定义关闭按钮的空白区域
      if (
        (e.target as HTMLElement)?.classList?.contains(
          this.prefixCls + "-close--custom"
        )
      ) {
        return;
      }

      if (this.closeFunc && isFunction(this.closeFunc)) {
        const isClose: boolean = await this.closeFunc();
        this.visibleRef = !isClose;
        return;
      }

      this.visibleRef = false;
      this.$emit("cancel", e);
    },

    /**
     * @description: 设置modal参数
     */
    setModalProps(props: Partial<ModalProps>): void {
      // Keep the last setModalProps
      this.propsRef = deepMerge(this.propsRef || ({} as any), props);
      if (Reflect.has(props, "visible")) {
        this.visibleRef = !!props.visible;
      }
      if (Reflect.has(props, "defaultFullscreen")) {
        this.fullScreenRef = !!props.defaultFullscreen;
      }
    },

    handleOk(e: Event) {
      this.$emit("ok", e);
    },

    handleHeightChange(height: string) {
      this.$emit("height-change", height);
    },

    handleExtHeight(height: number) {
      this.extHeightRef = height;
    },

    handleTitleDbClick(e: Event) {
      if (!this.canFullscreen) return;
      e.stopPropagation();
      this.handleFullScreen(e);
    },
  },
};
</script>
