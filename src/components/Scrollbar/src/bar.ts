import {
  defineComponent,
  h,
  computed,
  ref,
  getCurrentInstance,
  onUnmounted,
  inject,
  Ref,
} from "vue";
import { on, off } from "@/utils/domUtils";

import { renderThumbStyle, BAR_MAP } from "./util";

export default defineComponent({
  name: "Bar",

  props: {
    vertical: Boolean,
    size: String,
    move: Number,
  },

  setup(props) {
    const instance = getCurrentInstance()?.proxy;
    const thumb = ref();
    const wrap = inject(
      "scroll-bar-wrap",
      {} as Ref<Nullable<HTMLElement>>
    ) as any;
    const bar = computed(() => {
      return BAR_MAP[props.vertical ? "vertical" : "horizontal"];
    });
    const barStore = ref<Recordable>({});
    const cursorDown = ref();
    const clickThumbHandler = (e: any) => {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      // 清除选中文案
      window.getSelection()?.removeAllRanges();
      startDrag(e);
      barStore.value[bar.value.axis] =
        e.currentTarget[bar.value.offset] -
        (e[bar.value.client] -
          e.currentTarget.getBoundingClientRect()[bar.value.direction]);
    };

    const clickTrackHandler = (e: any) => {
      const thumb = instance?.$el.querySelector(
        ".scrollbar__thumb"
      ) as HTMLElement;
      const offset = Math.abs(
        e.target.getBoundingClientRect()[bar.value.direction] -
          e[bar.value.client]
      );
      // @ts-ignore
      const thumbHalf = thumb[bar.value.offset] / 2;
      const thumbPositionPercentage =
        // @ts-ignore
        ((offset - thumbHalf) * 100) / instance?.$el[bar.value.offset];

      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100;
    };
    const startDrag = (e: any) => {
      e.stopImmediatePropagation();
      cursorDown.value = true;
      on(document, "mousemove", mouseMoveDocumentHandler);
      on(document, "mouseup", mouseUpDocumentHandler);
      document.onselectstart = () => false;
    };

    const mouseMoveDocumentHandler = (e: any) => {
      if (cursorDown.value === false) return;
      const thumb = instance?.$el.querySelector(
        ".scrollbar__thumb"
      ) as HTMLElement;
      const prevPage = barStore.value[bar.value.axis];

      if (!prevPage) return;

      const offset =
        ((instance?.$el.getBoundingClientRect() as Recordable)[
          bar.value.direction
        ] -
          e[bar.value.client]) *
        -1;
      // @ts-ignore
      const thumbClickPosition = thumb[bar.value.offset] - prevPage;
      const thumbPositionPercentage =
        // @ts-ignore
        ((offset - thumbClickPosition) * 100) / instance?.$el[bar.value.offset];
      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100;
    };

    function mouseUpDocumentHandler() {
      cursorDown.value = false;
      barStore.value[bar.value.axis] = 0;
      off(document, "mousemove", mouseMoveDocumentHandler);
      document.onselectstart = null;
    }

    onUnmounted(() => {
      off(document, "mouseup", mouseUpDocumentHandler);
    });

    return () =>
      h(
        "div",
        {
          class: ["scrollbar__bar", "is-" + bar.value.key],
          on: {
            mousedown: clickTrackHandler,
          },
        },
        [
          h("div", {
            class: "scrollbar__thumb",
            style: renderThumbStyle({
              size: props.size,
              move: props.move,
              bar: bar.value,
            }),
            on: {
              mousedown: clickThumbHandler,
            },
          }),
        ]
      );
  },
});
