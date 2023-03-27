<template>
  <RadioGroup
    v-bind="attrs"
    v-model="state"
    button-style="solid"
    @change="handleChange"
  >
    <template v-for="item in getOptions">
      <RadioButton
        v-if="props.isBtn"
        :key="`${item.value}`"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </RadioButton>
      <Radio
        v-else
        :value="item.value"
        :disabled="item.disabled"
        :key="`${item.value}`"
      >
        {{ item.label }}
      </Radio>
    </template>
  </RadioGroup>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  unref,
  watch,
  onBeforeMount,
} from "vue";
import { Radio } from "ant-design-vue";
import { isFunction } from "@/utils/is";
import propTypes from "ant-design-vue/es/_util/vue-types/index";
import { get, omit } from "lodash-es";

type OptionsItem = {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
};

export default defineComponent({
  name: "ApiRadioGroup",
  components: {
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    Radio,
  },
  props: {
    api: {
      type: Function as PropType<
        (arg?: Recordable | string) => Promise<OptionsItem[]>
      >,
      default: null,
    },
    params: {
      type: [Object, String] as PropType<Recordable | string>,
      default: () => ({}),
    },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
    },
    isBtn: {
      type: [Boolean] as PropType<boolean>,
      default: false,
    },
    numberToString: propTypes.bool,
    resultField: propTypes.string.def(""),
    labelField: propTypes.string.def("label"),
    valueField: propTypes.string.def("value"),
    immediate: propTypes.bool.def(true),
  },
  emits: ["options-change", "change", "update:value"],
  setup(props, { emit, attrs: AllAttrs }) {
    const options = ref<OptionsItem[]>([]);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const attrs = computed(() => AllAttrs);
    const state = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
      },
    });

    // Processing options value
    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;

      return unref(options).reduce((prev, next: Recordable) => {
        if (next) {
          const value = next[valueField];
          prev.push({
            label: next[labelField],
            value: numberToString ? `${value}` : value,
            ...omit(next, [labelField, valueField]),
          });
        }
        return prev;
      }, [] as OptionsItem[]);
    });

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch();
      },
      { deep: true }
    );

    async function fetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      options.value = [];
      try {
        loading.value = true;
        const res = await api(props.params);
        if (Array.isArray(res)) {
          options.value = res;
          emitChange();
          return;
        }
        if (props.resultField) {
          options.value = get(res, props.resultField) || [];
        }
        emitChange();
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    function emitChange() {
      emit("options-change", unref(getOptions));
    }

    function handleChange(evt: Event) {
      // @ts-ignore
      emit("change", evt.target.value);
    }

    onBeforeMount(() => {
      props.immediate && fetch();
    });

    return { state, getOptions, attrs, loading, handleChange, props };
  },
});
</script>
