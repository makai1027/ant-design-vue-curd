<script lang="tsx">
import { Modal } from "ant-design-vue";
import { defineComponent, toRefs, h, computed } from "vue";
import { basicProps } from "../props";
import { useModalDragMove } from "../hooks/useModalDrag";
import { extendSlots } from "@/utils/tsxHelper";

export default defineComponent({
  name: "Modal",
  props: basicProps,
  emits: ["cancel"],
  setup(props, { slots, emit, attrs }) {
    const { visible, draggable, destroyOnClose } = toRefs(props);
    useModalDragMove({
      visible,
      destroyOnClose,
      draggable,
    });

    const onCancel = (e: Event) => {
      emit("cancel", e);
    };

    const propsData = computed(() => ({ ...attrs, ...props }));
    return () =>
      h(Modal, {
        props: propsData.value,
        on: {
          cancel: onCancel,
        },
        scopedSlots: extendSlots(slots),
      });
  },
});
</script>
