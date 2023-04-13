<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      {{ cancelText }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button :type="okType" @click="handleOk" :loading="confirmLoading" v-bind="okButtonProps" v-if="showOkBtn">
      {{ okText }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts">
import { Button } from "ant-design-vue";
import { basicProps } from "../props";
export default {
  name: "BasicModalFooter",
  components: {
    [Button.name]: Button,
  },
  props: basicProps,
  methods: {
    handleOk(e: Event) {
      this.$emit("ok", e);
    },

    handleCancel(e: Event) {
      this.$emit("cancel", e);
    },
  },

};
</script>
