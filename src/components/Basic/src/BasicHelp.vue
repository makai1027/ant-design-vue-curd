<script lang="ts">
import type { PropType, VNodeChildren, VNode } from "vue";
import { h } from "vue";
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

export default {
  name: "BasicHelp",
  components: { Tooltip },
  props,
  computed: {
    getTooltipStyle(): Recordable {
      return { color: this.color, fontSize: this.fontSize };
    },
    getOverlayStyle(): Recordable {
      return { maxWidth: this.maxWidth };
    },
  },
  methods: {
    renderTitle(): VNode | null {
      const textList = this.text;

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
              (this.showIndex ? `${index + 1}. ` : "") + text
            );
          })
        );
      }
      return null;
    },
  },
  render(_h) {
    const { prefixCls } = useDesign("basic-help");
    return _h(
      Tooltip,
      {
        props: {
          overlayClassName: `${prefixCls}__wrap`,
          autoAdjustOverflow: true,
          overlayStyle: this.getOverlayStyle,
          placement: this.placement || "right",
          getPopupContainer: () => getPopupContainer(),
        },
        scopedSlots: {
          title: () =>
            _h(
              "div",
              {
                style: this.getTooltipStyle,
              },
              [this.renderTitle() as VNodeChildren]
            ),
        },
      },
      [
        _h(
          "span",
          {
            class: prefixCls,
            scopedSlots: getSlot(this.$slots),
          },
          [
            _h(Icon, {
              props: {
                type: "info-circle",
              },
            }),
          ]
        ),
      ]
    );
  },
};
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
