<template>
  <a-cascader
    v-model="state"
    :options="options"
    :load-data="loadData"
    change-on-select
    @change="handleChange"
    :displayRender="handleRenderDisplay"
  >
    <a-icon v-if="loading" slot="suffixIcon" type="loading" />
  </a-cascader>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  unref,
  watch,
  onBeforeMount,
  computed,
} from "vue";
import { Cascader, Icon } from "ant-design-vue";
import propTypes from "ant-design-vue/es/_util/vue-types/index";
import { isFunction } from "@/utils/is";
import get from "lodash-es/get";
import omit from "lodash-es/omit";
import set from "lodash-es/set";

interface Option {
  value: string;
  label: string;
  loading?: boolean;
  isLeaf?: boolean;
  children?: Option[];
}
export default defineComponent({
  name: "ApiCascader",
  components: {
    [Icon.name]: Icon,
    [Cascader.name]: Cascader,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<Option[]>>,
      default: null,
    },
    numberToString: propTypes.bool,
    resultField: propTypes.string.def(""),
    labelField: propTypes.string.def("label"),
    valueField: propTypes.string.def("value"),
    childrenField: propTypes.string.def("children"),
    asyncFetchParamKey: propTypes.string.def("parentCode"),
    immediate: propTypes.bool.def(true),
    // init fetch params
    initFetchParams: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    // 是否有下级，默认是
    isLeaf: {
      type: Function as PropType<(arg: Recordable) => boolean>,
      default: null,
    },
    displayRenderArray: {
      type: Array,
    },
  },
  emits: ["change", "defaultChange", "update:value"],
  setup(props, { emit }) {
    const apiData = ref<any[]>([]);
    const options = ref<Option[]>([]);
    const loading = ref<boolean>(false);
    const emitData = ref<any[]>([]);
    const isFirstLoad = ref(true);
    const state = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
        emit("change", val);
      },
    });
    watch(
      apiData,
      (data) => {
        const opts = generatorOptions(data);
        options.value = opts;
      },
      { deep: true }
    );

    function generatorOptions(options: any[]): Option[] {
      const { labelField, valueField, numberToString, childrenField, isLeaf } =
        props;
      return options.reduce((prev, next: Recordable) => {
        if (next) {
          const value = next[valueField];
          const item = {
            ...omit(next, [labelField, valueField]),
            label: next[labelField],
            value: numberToString ? `${value}` : value,
            isLeaf:
              isLeaf && typeof isLeaf === "function" ? isLeaf(next) : false,
          };
          const children = get(next, childrenField);
          if (children) {
            set(item, childrenField, generatorOptions(children));
          }
          prev.push(item);
        }
        return prev;
      }, [] as Option[]);
    }

    async function initialFetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      apiData.value = [];
      loading.value = true;
      try {
        const res = await api(props.initFetchParams);
        if (Array.isArray(res)) {
          apiData.value = res.map((el) => {
            el.loading = false;
            return el;
          });
          return;
        }
        if (props.resultField) {
          apiData.value = get(res, props.resultField) || [];
          apiData.value.map((el) => {
            el.loading = false;
            return el;
          });
        }
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    async function loadData(selectedOptions: Option[]) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      const api = props.api;

      if (!api || !isFunction(api)) return;
      try {
        const res = await api({
          [props.asyncFetchParamKey]: get(targetOption, "value"),
        });

        if (Array.isArray(res)) {
          const children = generatorOptions(res);
          targetOption.children = children.map((el) => {
            el.loading = false;
            return toReactive(el);
          });
          return;
        }

        if (props.resultField) {
          const children = generatorOptions(get(res, props.resultField) || []);
          targetOption.children = children.map((el) => {
            el.loading = false;
            return toReactive(el);
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        targetOption.loading = false;
      }
    }

    watch(
      () => props.initFetchParams,
      () => {
        !unref(isFirstLoad) && initialFetch();
      },
      { deep: true }
    );

    function handleChange(keys: any, args: any) {
      emitData.value = keys;
      emit("defaultChange", keys, args);
    }

    function handleRenderDisplay({ labels, selectedOptions }: Recordable) {
      if (unref(emitData).length === selectedOptions.length) {
        return labels.join(" / ");
      }
      if (props.displayRenderArray) {
        return props.displayRenderArray.join(" / ");
      }
      return "";
    }

    onBeforeMount(() => {
      props.immediate && initialFetch();
    });

    return {
      state,
      options,
      loading,
      handleChange,
      loadData,
      handleRenderDisplay,
    };
  },
});
</script>
