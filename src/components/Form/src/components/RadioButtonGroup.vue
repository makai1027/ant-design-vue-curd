<template>
  <RadioGroup v-bind="attrs" v-model="state" button-style="solid">
    <template v-for="item in getOptions">
      <RadioButton
        :value="item.value"
        :disabled="item.disabled"
        :key="`${item.value}`"
      >
        {{ item.label }}
      </RadioButton>
    </template>
  </RadioGroup>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { Radio } from "ant-design-vue";
import { isString } from "@/utils/is";
import { useRuleFormItem } from "@/hooks/component/useFormItem";

type OptionsItem = {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
};
type RadioItem = string | OptionsItem;

export default defineComponent({
  name: "RadioButtonGroup",
  components: {
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
  },
  props: {
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
    },
    options: {
      type: Array as PropType<RadioItem[]>,
      default: () => [],
    },
  },
  setup(props, { attrs }) {
    // Embedded in the form, just use the hook binding to perform form verification
    const [state] = useRuleFormItem(props);

    // Processing options value
    const getOptions = computed((): OptionsItem[] => {
      const { options } = props;
      if (!options || options?.length === 0) return [];

      const isStringArr = options.some((item) => isString(item));
      if (!isStringArr) return options as OptionsItem[];

      return options.map((item) => ({
        label: item,
        value: item,
      })) as OptionsItem[];
    });

    return { state, getOptions, attrs };
  },
});
</script>