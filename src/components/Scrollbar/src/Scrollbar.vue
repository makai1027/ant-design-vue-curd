<template>
  <div class="scrollbar">
    <div
      ref="wrap"
      :class="[
        wrapClass,
        'scrollbar__wrap',
        native ? '' : 'scrollbar__wrap--hidden-default',
      ]"
      :style="style"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resize"
        :class="['scrollbar__view', viewClass]"
        :style="viewStyle"
      >
        <slot></slot>
      </component>
    </div>
    <template v-if="!native">
      <bar :move="moveX" :size="sizeWidth" />
      <bar vertical :move="moveY" :size="sizeHeight" />
    </template>
  </div>
</template>
<script lang="ts">
import { toObject, useResizeObserver } from "./util";
import Bar from "./bar.vue";
type DataState = {
  sizeWidth: string;
  sizeHeight: string;
  moveX: number;
  moveY: number;
  stop0: (() => void) | null;
  stop1: (() => void) | null;
  stop2: (() => void) | null;
};
export default {
  name: "Scrollbar",
  components: { Bar },
  props: {
    native: {
      type: Boolean,
      default: false,
    },
    wrapStyle: {
      type: [String, Array],
      default: "",
    },
    wrapClass: {
      type: [String, Array],
      default: "",
    },
    viewClass: {
      type: [String, Array],
      default: "",
    },
    viewStyle: {
      type: [String, Array],
      default: "",
    },
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: "div",
    },
  },
  data(): DataState {
    return {
      sizeWidth: "0",
      sizeHeight: "0",
      moveX: 0,
      moveY: 0,
      stop0: null,
      stop1: null,
      stop2: null,
    };
  },
  computed: {
    style(): any {
      if (Array.isArray(this.wrapStyle)) {
        return toObject(this.wrapStyle);
      }
      return this.wrapStyle;
    },
  },
  provide() {
    return {
      scrollBarWrap: this.$refs.wrap,
    };
  },
  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    if (!this.noresize) {
      const resize = this.$refs.resize as HTMLElement;
      const wrap = this.$refs.wrap as HTMLElement;
      const { cleanup: stop0 } = useResizeObserver(resize, this.update);
      this.stop0 = stop0;
      const { cleanup: stop1 } = useResizeObserver(wrap, this.update);
      this.stop1 = stop1;
      const { cleanup: stop2 } = useResizeObserver(document.body, this.update);
      this.stop2 = stop2;
    }
  },
  methods: {
    handleScroll() {
      if (!this.native) {
        const wrap = this.$refs.wrap as HTMLElement;
        this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
        this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
      }
    },

    update() {
      const wrap = this.$refs.wrap as HTMLElement;
      if (!wrap) return;
      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + "%" : "";
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + "%" : "";
    },
  },
  beforeDestroy() {
    this.stop0 && this.stop0();
    this.stop1 && this.stop1();
    this.stop2 && this.stop2();
  },
};
</script>
<style lang="less">
.scrollbar {
  position: relative;
  height: 100%;
  overflow: hidden;

  &__wrap {
    height: 100%;
    overflow: auto;

    &--hidden-default {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        opacity: 0%;
      }
    }
  }

  &__thumb {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    background-color: rgb(144 147 153 / 30%);
    border-radius: inherit;
    transition: 0.3s background-color;

    &:hover {
      background-color: rgb(144 147 153 / 50%);
    }
  }

  &__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0%;
    transition: opacity 80ms ease;

    &.is-vertical {
      top: 2px;
      width: 6px;

      & > div {
        width: 100%;
      }
    }

    &.is-horizontal {
      left: 2px;
      height: 6px;

      & > div {
        height: 100%;
      }
    }
  }
}

.scrollbar:active > .scrollbar__bar,
.scrollbar:focus > .scrollbar__bar,
.scrollbar:hover > .scrollbar__bar {
  opacity: 100%;
  transition: opacity 340ms ease-out;
}
</style>
