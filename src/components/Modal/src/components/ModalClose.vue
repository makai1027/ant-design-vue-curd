<template>
  <div :class="getClass">
    <template v-if="canFullscreen">
      <Tooltip title="还原" placement="bottom" v-if="fullScreen">
        <span role="full" @click="handleFullScreen">
          <a-icon type="fullscreen-exit" />
        </span>
      </Tooltip>
      <Tooltip title="最大化" placement="bottom" v-else>
        <span role="close" @click="handleFullScreen">
          <a-icon type="fullscreen" />
        </span>
      </Tooltip>
    </template>
    <Tooltip title="关闭弹窗" placement="bottom">
      <span @click="handleCancel"><a-icon type="close-circle" /></span>
    </Tooltip>
  </div>
</template>
<script lang="ts">
import { useDesign } from "@/utils/index";
import { Tooltip, Icon } from "ant-design-vue";

export default {
  name: "ModalClose",
  components: {
    Tooltip,
    [Icon.name]: Icon,
  },
  props: {
    canFullscreen: { type: Boolean, default: true },
    fullScreen: { type: Boolean },
  },
  computed: {
    getClass(): string[] {
      const { prefixCls } = useDesign("basic-modal-close");

      return [
        prefixCls,
        `${prefixCls}--custom`,
        this.canFullscreen ? `${prefixCls}--can-full` : ''
      ];
    }
  },
  methods: {
    handleCancel(e: Event) {
      this.$emit("cancel", e);
    },

    handleFullScreen(e: Event) {
      e?.stopPropagation();
      e?.preventDefault();
      this.$emit("fullscreen");
    }
  },
};
</script>
<style lang="less">
@prefix-cls: ~"@{namespace}-basic-modal-close";

.@{prefix-cls} {
  display: flex;
  height: 95%;
  align-items: center;

  >span {
    margin-left: 48px;
    font-size: 16px;
  }

  &--can-full {
    >span {
      margin-left: 12px;
    }
  }

  &:not(&--can-full) {
    >span:nth-child(1) {
      &:hover {
        font-weight: 700;
      }
    }
  }

  & span:nth-child(1) {
    display: inline-block;
    padding: 0 10px;

    &:hover {
      color: @primary-color;
    }
  }

  & span:last-child {
    &:hover {
      color: #f56c6c;
    }
  }
}
</style>
