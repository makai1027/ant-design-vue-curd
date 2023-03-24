<script lang="tsx">
import type { PropType } from "vue";
import { defineComponent, computed, unref, h } from "vue";
import { Tooltip, Icon } from "ant-design-vue";
import { getPopupContainer, useDesign } from "@/utils";
import { isString, isArray } from "@/utils/is";
import { getSlot } from "@/utils/tsxHelper";

const props = {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth: { type: String, default: "600px" },
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex: { type: Boolean },
  /**
   * Help text font color
   * @default: #ffffff
   */
  color: { type: String, default: "#ffffff" },
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize: { type: String, default: "14px" },
  /**
   * Help text list
   */
  placement: { type: String, default: "right" },
  /**
   * Help text list
   */
  text: { type: [Array, String] as PropType<string[] | string> },
};

export default defineComponent({
  name: "BasicHelp",
  components: { Tooltip },
  props,
  setup(props, { slots }) {
    const { prefixCls } = useDesign("basic-help");

    const getTooltipStyle = computed(
      (): Recordable => ({ color: props.color, fontSize: props.fontSize })
    );

    const getOverlayStyle = computed(
      (): Recordable => ({ maxWidth: props.maxWidth })
    );

    function renderTitle() {
      const textList = props.text;

      if (isString(textList)) {
        return h("p", {}, textList);
      }

      if (isArray(textList)) {
        return h(
          "div",
          {},
          textList.map((text, index) => {
            return h(
              "p",
              { attrs: { key: text } },
              (props.showIndex ? `${index + 1}. ` : "") + text
            );
          })
        );
      }
      return null;
    }

    return () => {
      return (
        <Tooltip
          overlayClassName={`${prefixCls}__wrap`}
          autoAdjustOverflow={true}
          overlayStyle={unref(getOverlayStyle)}
          placement={props.placement as "right"}
          getPopupContainer={() => getPopupContainer()}
        >
          <template slot="title">
            <div style={unref(getTooltipStyle)}>{renderTitle()}</div>
          </template>
          <span class={prefixCls}>
            {getSlot(slots) || <Icon type="info-circle" />}
          </span>
        </Tooltip>
      );
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~"@{namespace}-basic-help";

.@{prefix-cls} {
  display: inline-block;
  margin-left: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: @primary-color;
  }

  &__wrap {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
