<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      ref="basicModal"
      destroyOnClose
      title="Modal Title"
      :helpMessage="['提示1', '提示2']"
      @visible-change="handleShow"
    >
      <template #insertFooter>
        <Button type="primary" danger @click="setLines" :disabled="loading"
          >点我更新内容</Button
        >
      </template>
      <template v-if="loading">
        <div class="empty-tips">加载中，稍等3秒……</div>
      </template>
      <template v-if="!loading">
        <ul>
          <li v-for="index in lines" :key="index">加载完成{{ index }}！</li>
        </ul>
      </template>
    </BasicModal>

    <Button @click="openModal">点击显示</Button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { BasicModal, ModalProps } from "@/components/Modal";
import { Button } from "ant-design-vue";
export default defineComponent({
  components: { BasicModal, Button },
  setup() {
    const loading = ref(true);
    const lines = ref(10);
    const basicModal = ref();

    const setModalProps = (params: Partial<ModalProps>) => {
      basicModal.value.setModalProps(params);
    };
    const redoModalHeight = () => {
      basicModal.value.redoModalHeight();
    };
    watch(
      () => lines.value,
      () => {
        redoModalHeight();
      }
    );

    function handleShow(visible: boolean) {
      if (visible) {
        loading.value = true;
        setModalProps({ loading: true, confirmLoading: true });
        setTimeout(() => {
          lines.value = Math.round(Math.random() * 60 + 5);
          loading.value = false;
          setModalProps({ loading: false, confirmLoading: false });
        }, 3000);
      }
    }

    function setLines() {
      lines.value = Math.round(Math.random() * 20 + 10);
    }

    const openModal = () => {
      setModalProps({
        visible: true,
      });
    };
    return { basicModal, loading, handleShow, lines, setLines, openModal };
  },
});
</script>
<style scoped>
.empty-tips {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
