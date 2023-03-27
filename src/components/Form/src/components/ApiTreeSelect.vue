<template>
  <a-tree-select v-bind="getAttrs" v-model="state" @change="handleChange">
    <template #[item]="data" v-for="item in Object.keys(slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <a-icon type="loading" />
    </template>
  </a-tree-select>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref, onMounted, unref } from "vue";
import { TreeSelect, Icon } from "ant-design-vue";
import { isArray, isFunction } from "@/utils/is";
import { get } from "lodash-es";
import propTypes from "ant-design-vue/es/_util/vue-types/index";

export default defineComponent({
  name: "ApiTreeSelect",
  components: { ATreeSelect: TreeSelect, [Icon.name]: Icon },
  props: {
    value: {
      type: [String, Array],
    },
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<Recordable>>,
    },
    params: { type: Object },
    immediate: { type: Boolean, default: true },
    resultField: propTypes.string.def(""),
  },
  emits: ["options-change", "change", "update:value"],
  setup(props, { attrs, emit, slots }) {
    const treeData = ref<Recordable[]>([]);
    const isFirstLoaded = ref<Boolean>(false);
    const loading = ref(false);
    const getAttrs = computed(() => {
      return {
        ...(props.api ? { treeData: unref(treeData) } : {}),
        ...attrs,
      };
    });

    const state = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
      },
    });

    function handleChange(value: any) {
      emit("change", value);
    }

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoaded) && fetch();
      },
      { deep: true }
    );

    watch(
      () => props.immediate,
      (v) => {
        v && !isFirstLoaded.value && fetch();
      }
    );

    onMounted(() => {
      props.immediate && fetch();
    });

    async function fetch() {
      const { api } = props;
      if (!api || !isFunction(api)) return;
      loading.value = true;
      treeData.value = [];
      let result;
      try {
        result = await api(props.params);
      } catch (e) {
        console.error(e);
      }
      loading.value = false;
      if (!result) return;
      if (!isArray(result)) {
        result = get(result, props.resultField);
      }
      treeData.value = (result as Recordable[]) || [];
      isFirstLoaded.value = true;
      emit("options-change", treeData.value);
    }
    return { getAttrs, loading, handleChange, slots, state };
  },
});
</script>
