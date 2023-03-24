<template>
  <div title="可折叠表单示例">
    <Card size="small" title="基础收缩示例" class="!mb-4">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </Card>

    <Card size="small" title="超过3行自动收起，折叠时保留2行" class="mt-4">
      <BasicForm @register="register1" />
    </Card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { Card } from "ant-design-vue";

const getSchamas = (): FormSchema[] => {
  return [
    {
      field: "field1",
      component: "Input",
      label: "字段1",
      colProps: {
        span: 8,
      },
      componentProps: {
        placeholder: "自定义placeholder",
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: "field2",
      component: "Input",
      label: "字段2",
      defaultValue: "你好vue",
      colProps: {
        span: 8,
      },
    },
    {
      field: "field3",
      component: "DatePicker",
      label: "字段3",
      colProps: {
        span: 8,
      },
    },
    {
      field: "field4",
      component: "Select",
      label: "字段4",
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          {
            label: "选项1",
            value: "1",
            key: "1",
          },
          {
            label: "选项2",
            value: "2",
            key: "2",
          },
        ],
      },
    },
    {
      field: "field5",
      component: "CheckboxGroup",
      label: "字段5",
      colProps: {
        span: 8,
      },
      defaultValue: ["2"],
      componentProps: {
        options: [
          {
            label: "选项1",
            value: "1",
          },
          {
            label: "选项2",
            value: "2",
          },
        ],
      },
    },
    // {
    //   field: 'field7',
    //   component: 'RadioGroup',
    //   label: '字段7',
    //   colProps: {
    //     span: 8,
    //   },
    //   componentProps: {
    //     options: [
    //       {
    //         label: '选项1',
    //         value: '1',
    //       },
    //       {
    //         label: '选项2',
    //         value: '2',
    //       },
    //     ],
    //   },
    // },
  ];
};

function getAppendSchemas(): FormSchema[] {
  return [
    {
      field: "field10",
      component: "Input",
      label: "字段10",
      colProps: {
        span: 8,
      },
    },
    {
      field: "field11",
      component: "Input",
      label: "字段11",
      colProps: {
        span: 8,
      },
    },
    {
      field: "field12",
      component: "Input",
      label: "字段12",
      colProps: {
        span: 8,
      },
    },
    {
      field: "field13",
      component: "Input",
      label: "字段13",
      colProps: {
        span: 8,
      },
    },
  ];
}
export default defineComponent({
  components: { BasicForm, Card },
  setup() {
    const [register, { getFieldsValue }] = useForm({
      labelWidth: 120,
      schemas: getSchamas(),
      actionColOptions: {
        span: 24,
      },
      compact: true,
      showAdvancedButton: true,
    });
    const extraSchemas: FormSchema[] = [];
    for (let i = 14; i < 30; i++) {
      extraSchemas.push({
        field: "field" + i,
        component: "Input",
        label: "字段" + i,
        colProps: {
          span: 8,
        },
      });
    }
    const [register1] = useForm({
      labelWidth: 120,
      schemas: [
        ...getSchamas(),
        ...getAppendSchemas(),
        { field: "", component: "Divider", label: "更多字段" },
        ...extraSchemas,
      ],
      actionColOptions: {
        span: 24,
      },
      compact: true,
      showAdvancedButton: true,
      alwaysShowLines: 2,
    });
    return {
      register,
      register1,
      handleReset: (...args: any) => {
        console.log(args, "???", getFieldsValue());
      },
      handleSubmit: (values: any) => {
        console.log("values", values);
      },
    };
  },
});
</script>
