<template>
  <div>
    <BasicModal
      title="Modal Title"
      :helpMessage="['提示1', '提示2']"
      :okButtonProps="{ disabled: true }"
      ref="basicModal"
    >
      <a-button type="primary" @click="closeModal" class="mr-2">
        从内部关闭弹窗
      </a-button>
      <a-button type="primary" @click="setModalProps">
        从内部修改title
      </a-button>
    </BasicModal>
    <a-button @click="openModal">点击显示</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BasicModal, ModalProps } from "@/components/Modal";
import { Button } from "ant-design-vue";
export default defineComponent({
  components: { BasicModal, [Button.name]: Button },
  setup() {
    const basicModal = ref();
    const closeModal = () => {
      basicModal.value.setModalProps({
        visible: false,
      });
    };
    const openModal = () => {
      setModalProps({
        visible: true,
      });
    };
    const setModalProps = (params: Partial<ModalProps>) => {
      basicModal.value.setModalProps(params);
    };
    return {
      basicModal,
      closeModal,
      openModal,
      setModalProps: () => {
        setModalProps({ title: "Modal New Title" });
      },
    };
  },
});
</script>
