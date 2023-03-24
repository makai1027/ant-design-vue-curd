<template>
  <Button v-bind="getBindValue" :class="getButtonClass">
    <slot v-bind="getBindValue || {}"></slot>
  </Button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Button } from "ant-design-vue";
export default defineComponent({
  name: "AButton",
  extends: Button,
});
</script>
<script lang="ts" setup>
import { computed, unref, useAttrs } from "vue";
import { buttonProps } from "./props";

const props = defineProps(buttonProps);
// get component class
const attrs = useAttrs();
const getButtonClass = computed(() => {
  const { color, disabled } = props;
  return [
    {
      [`ant-btn-${color}`]: !!color,
      [`is-disabled`]: disabled,
    },
  ];
});

// get inherit binding value
const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
</script>
