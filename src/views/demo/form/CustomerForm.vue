<template>
  <Card title="自定义表单">
    <BasicForm @register="register" @submit="handleSubmit">
      <template #f3="{ model, field }">
        <a-input v-model:value="model[field]" placeholder="自定义slot" />
      </template>
    </BasicForm>
  </Card>
</template>
<script lang="ts">
import { defineComponent, h } from "vue";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { Input, Card, message } from "ant-design-vue";

const schemas: FormSchema[] = [
  {
    field: "field1",
    component: "Input",
    label: "render方式",
    colProps: {
      span: 8,
    },
    defaultValue: "",
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(Input, {
        style: {},
        props: {
          placeholder: "请输入",
          allowClear: true,
          value: model[field],
        },
        on: {
          change: (e: ChangeEvent) => {
            model[field] = e.target.value;
          },
        },
      });
    },
  },
  {
    field: "field2",
    component: "Input",
    label: "render组件slot",
    colProps: {
      span: 8,
    },
    rules: [{ required: true }],
    renderComponentContent: () => {
      return {
        suffix: () => "suffix",
      };
    },
  },
  {
    field: "field3",
    component: "Input",
    label: "自定义Slot",
    slot: "f3",
    colProps: {
      span: 8,
    },
    rules: [{ required: true }],
  },
];
export default defineComponent({
  components: {
    BasicForm,
    Card,
    [Input.name]: Input,
  },
  setup() {
    const [register, { setProps }] = useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24,
      },
    });
    return {
      register,
      schemas,
      handleSubmit: (values: any) => {
        message.success("click search,values:" + JSON.stringify(values));
      },
      setProps,
    };
  },
});
</script>
