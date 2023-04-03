<template>
  <Select
    @dropdownVisibleChange="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    v-model="state"
  >
    <template #[item]="data" v-for="item in Object.keys(slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <a-icon type="loading" />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <a-icon type="loading" class="mr-1" />
        请等待数据加载完成...
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  onBeforeMount,
  computed,
  unref,
  watch,
} from "vue";
import { Select, Icon } from "ant-design-vue";
import { isFunction } from "@/utils/is";
import get from "lodash-es/get";
import omit from "lodash-es/omit";

import propTypes from "ant-design-vue/es/_util/vue-types/index";

type OptionsItem = { label: string; value: string; disabled?: boolean };

export default defineComponent({
  name: "ApiSelect",
  components: {
    Select,
    [Icon.name]: Icon,
  },
  props: {
    value: [Array, Object, String, Number],
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
      default: null,
    },
    // api params
    params: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    // support xxx.xxx.xx
    resultField: propTypes.string.def(""),
    labelField: propTypes.string.def("label"),
    valueField: propTypes.string.def("value"),
    immediate: propTypes.bool.def(true),
    alwaysLoad: propTypes.bool.def(false),
  },
  emits: ["options-change", "change", "update:value"],
  setup(props, { emit, attrs, slots }) {
    const options = ref<OptionsItem[]>([]);
    const loading = ref(false);
    const isFirstLoad = ref(true);

    const state = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
      },
    });

    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;

      return unref(options).reduce((prev, next: Recordable) => {
        if (next) {
          const value = next[valueField];
          prev.push({
            ...omit(next, [labelField, valueField]),
            label: next[labelField],
            value: numberToString ? `${value}` : value,
          });
        }
        return prev;
      }, [] as OptionsItem[]);
    });

    onBeforeMount(() => {
      props.immediate && !props.alwaysLoad && fetch();
    });

    watch(
      () => state.value,
      (v) => {
        emit("update:value", v);
      }
    );

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

    async function handleFetch(visible: boolean) {
      if (visible) {
        if (props.alwaysLoad) {
          await fetch();
        } else if (!props.immediate && unref(isFirstLoad)) {
          await fetch();
          isFirstLoad.value = false;
        }
      }
    }

    function emitChange() {
      emit("options-change", unref(getOptions));
    }

    function handleChange(value: any) {
      // @ts-ignore
      emit("change", value);
    }

    return {
      state,
      attrs,
      getOptions,
      loading,
      handleFetch,
      handleChange,
      slots,
    };
  },
});
</script>
