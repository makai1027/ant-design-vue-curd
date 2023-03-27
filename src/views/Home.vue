<template>
  <div>
    <div>
      <ApiCascader
        :api="areaRecord"
        resuldField="result"
        apiParamKey="parentCode"
        dataField="data"
        labelField="name"
        valueField="code"
        :initFetchParams="{ parentCode: '' }"
        :isLeaf="
          (record) => {
            return !(record.levelType < 3);
          }
        "
      />
    </div>

    <ApiRadioGroup
      :value.sync="radio"
      :api="optionsListApi"
      :params="{ count: 2 }"
      resultField="list"
      buttonStyle="solid"
      :isBtn="true"
      labelField="name"
      valueField="id"
      @change="changeHandler"
    />

    <div>
      <ApiSelect
        :modelValue="cascader"
        :api="optionsListApi"
        :params="{
          id: 1,
        }"
        style="width: 240px"
        :allowClear="true"
        resultField="list"
        labelField="name"
        valueField="id"
        :immediate="false"
        :onChange="
          (e) => {
            console.log('selected:', e);
          }
        "
        :onOptionsChange="
          (options) => {
            console.log('get options', options.length, options);
          }
        "
      />
    </div>

    <api-tree
      :selectedKeys.sync="treeValue"
      :api="treeOptionsListApi"
      resultField="list"
      selectable
      @select="changeHandler"
    />
    <div>
      <api-tree-select
        :api="treeOptionsListApi"
        resultField="list"
        style="width: 240px"
        show-search
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="Please select"
        allow-clear
        tree-default-expand-all
      />
    </div>
    <button @click="plus">+++++</button>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, unref, watch } from "vue";
import { areaRecord } from "@/api/demo/cascader";
import { optionsListApi } from "@/api/demo/select";
import { treeOptionsListApi } from "@/api/demo/tree";
const number = ref(1);
const plus = () => {
  number.value++;
};
const radio = ref();
const _num = computed(() => unref(number) + 3);
const cascader = ref(0);
const changeHandler = (val) => {
  console.log(val, "1-------------");
};
const treeValue = ref(["4"]);
watch(
  () => treeValue.value,
  (value) => {
    console.log(value);
  },
  {
    deep: true,
  }
);
</script>
