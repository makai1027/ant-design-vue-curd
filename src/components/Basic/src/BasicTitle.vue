<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp
      :class="`${prefixCls}-help`"
      v-if="helpMessage"
      :text="helpMessage"
    />
  </span>
</template>

<script lang="ts">
import type { PropType } from "vue";
import BasicHelp from "./BasicHelp.vue";
import { useDesign } from "@/utils";
export default {
  name: "BasicTitle",
  props: {
    /**
     * Help text list or string
     * @default: ''
     */
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: "",
    },
    /**
     * Whether the color block on the left side of the title
     * @default: false
     */
    span: { type: Boolean },
    /**
     * Whether to default the text, that is, not bold
     * @default: false
     */
    normal: { type: Boolean },
  },
  components: {
    BasicHelp,
  },
  computed: {
    getClass() {
      const { prefixCls } = useDesign("basic-title");
      const slots = this.$slots;
      return [
        prefixCls,
        { [`${prefixCls}-show-span`]: this.span && slots.default },
        { [`${prefixCls}-normal`]: this.normal },
      ];
    },
  },
};
</script>
<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-basic-title";

.@{prefix-cls} {
  position: relative;
  display: flex;
  padding-left: 7px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  cursor: pointer;
  user-select: none;

  &-normal {
    font-size: 14px;
    font-weight: 500;
  }

  &-show-span::before {
    position: absolute;
    top: 4px;
    left: 0;
    width: 3px;
    height: 16px;
    margin-right: 4px;
    background-color: @primary-color;
    content: "";
  }

  &-help {
    margin-left: 10px;
  }
}
</style>
