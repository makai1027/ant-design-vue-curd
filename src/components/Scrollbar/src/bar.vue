<template>
  <div
    ref="barwrap"
    :class="[' scrollbar__bar', 'is-' + bar.key]"
    @mousedown="clickTrackHandler"
  >
    <div
      ref="thumb"
      class="scrollbar__thumb"
      :style="thumbStyle"
      @mousedown="clickThumbHandler"
    ></div>
  </div>
</template>
<script lang="ts">
import { on, off } from "@/utils/domUtils";
import { renderThumbStyle, BAR_MAP } from "./util";

type DataState = {
  barStore: Recordable;
  cursorDown: boolean;
  thumbStyle: Recordable;
};
export default {
  name: "Bar",
  props: {
    vertical: Boolean,
    size: String,
    move: Number,
  },
  data(): DataState {
    return {
      barStore: {},
      cursorDown: false,
      thumbStyle: {},
    };
  },
  inject: ["scrollBarWrap"],
  computed: {
    bar() {
      return BAR_MAP[this.vertical ? "vertical" : "horizontal"];
    },
    styleObj() {
      return {
        size: this.size,
        move: this.move,
        bar: this.bar,
      };
    },
  },
  watch: {
    styleObj: {
      handler(val) {
        this.thumbStyle = renderThumbStyle(val);
      },
      deep: true,
    },
  },
  methods: {
    clickThumbHandler(e: any) {
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      // 清除选中文案
      window.getSelection()?.removeAllRanges();
      this.startDrag(e);
      this.barStore[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] -
          e.currentTarget.getBoundingClientRect()[this.bar.direction]);
    },

    clickTrackHandler(e: any) {
      const instance = this.$refs.barwrap as HTMLElement & Recordable;
      const thumb = this.$refs.thumb as HTMLElement & Recordable;
      const offset = Math.abs(
        e.target.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]
      );
      const thumbHalf = thumb[this.bar.offset] / 2;
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100) / instance[this.bar.offset];

      (this.scrollBarWrap as Recordable)[this.bar.scroll] =
        (thumbPositionPercentage *
          (this.scrollBarWrap as Recordable)[this.bar.scrollSize]) /
        100;
    },
    startDrag(e: any) {
      e.stopImmediatePropagation();
      this.cursorDown = true;
      on(document, "mousemove", this.mouseMoveDocumentHandler);
      on(document, "mouseup", this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e: any) {
      if (this.cursorDown === false) return;
      const instance = this.$refs.barwrap as HTMLElement & Recordable;
      const thumb = this.$refs.thumb as HTMLElement & Recordable;
      const prevPage = this.barStore[this.bar.axis];

      if (!prevPage) return;

      const offset =
        ((instance?.$el.getBoundingClientRect() as Recordable)[
          this.bar.direction
        ] -
          e[this.bar.client]) *
        -1;
      const thumbClickPosition = thumb[this.bar.offset] - prevPage;
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / instance[this.bar.offset];
      (this.scrollBarWrap as Recordable)[this.bar.scroll] =
        (thumbPositionPercentage *
          (this.scrollBarWrap as Recordable)[this.bar.scrollSize]) /
        100;
    },

    mouseUpDocumentHandler() {
      this.cursorDown = false;
      this.barStore[this.bar.axis] = 0;
      off(document, "mousemove", this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    },
  },
  beforeDestroy() {
    off(document, "mouseup", this.mouseUpDocumentHandler);
  },
};
</script>
