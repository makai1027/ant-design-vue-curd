<template>
  <div>
    <BasicModal
      :visible.sync="visible"
      v-bind="attrs"
      wrapClassName="wrapClassName"
      title="Modal Title3333333"
      :helpMessage="['提示1', '提示2']"
      width="700px"
    >
      <p class="h-20" v-for="index in 20" :key="index">根据屏幕高度自适应</p>
    </BasicModal>
    <a-button @click="toggleModal">显示隐藏弹窗</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BasicModal } from "@/components/Modal";
import { Button } from "ant-design-vue";
export default defineComponent({
  name: "Modal3",
  components: { BasicModal, [Button.name]: Button },
  setup(props, { attrs }) {
    const visible = ref(false);
    const toggleModal = () => {
      visible.value = !visible.value;
    };
    return {
      attrs,
      visible,
      toggleModal,
    };
  },
});
</script>
