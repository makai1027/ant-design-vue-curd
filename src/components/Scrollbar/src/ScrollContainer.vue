<template>
  <Scrollbar ref="scrollbarRef" class="scroll-container" v-bind="$attrs">
    <slot></slot>
  </Scrollbar>
</template>

<script lang="ts">
import Scrollbar from "./Scrollbar.vue";
import { useScrollTo } from "@/hooks/event/useScrollTo";

export default {
  name: "ScrollContainer",
  components: { Scrollbar },
  methods: {
    /**
     * Scroll to the specified position
     */
    scrollTo(to: number, duration = 500) {
      const scrollbar = this.$refs.scrollbarRef as HTMLElement & Recordable;
      if (!scrollbar) {
        return;
      }
      this.$nextTick(() => {
        const wrap = scrollbar.$refs.wrap;
        if (!wrap) {
          return;
        }
        const { start } = useScrollTo({
          el: wrap,
          to,
          duration,
        });
        start();
      });
    },

    getScrollWrap() {
      const scrollbar = this.$refs.scrollbarRef as HTMLElement & Recordable;
      if (!scrollbar) {
        return null;
      }
      return scrollbar.$refs.wrap;
    },

    /**
     * Scroll to the bottom
     */
    scrollBottom() {
      const scrollbar = this.$refs.scrollbarRef as HTMLElement & Recordable;
      if (!scrollbar) {
        return;
      }
      this.$nextTick(() => {
        const wrap = scrollbar.$refs.wrap;
        if (!wrap) {
          return;
        }
        const scrollHeight = wrap.scrollHeight as number;
        const { start } = useScrollTo({
          el: wrap,
          to: scrollHeight,
        });
        start();
      });
    },
  },
};
</script>
<style lang="less">
.scroll-container {
  width: 100%;
  height: 100%;

  .scrollbar__wrap {
    margin-bottom: 18px !important;
    overflow-x: hidden;
  }

  .scrollbar__view {
    box-sizing: border-box;
  }
}
</style>
