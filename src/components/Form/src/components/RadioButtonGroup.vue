<template>
  <RadioGroup
    v-bind="attrs"
    v-model="state"
    button-style="solid"
    @change="changeHandler"
  >
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
  emits: ["update:value", "change"],
  setup(props, { attrs, emit }) {
    const state = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
      },
    });

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
    const changeHandler = (evt: Event) => {
      // @ts-ignore
      emit("change", evt.target.value);
    };

    return { state, getOptions, attrs, changeHandler };
  },
});
</script>
