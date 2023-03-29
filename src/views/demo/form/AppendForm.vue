<template>
  <Card size="small" title="表单增删" class="!mb-4">
    <BasicForm @register="register" @submit="handleSubmit">
      <template #add="{ field }">
        <Button v-if="Number(field) === 0" @click="add">+</Button>
        <Button v-if="field > 0" @click="del(field)">-</Button>
      </template>
    </BasicForm>
  </Card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BasicForm, useForm } from "@/components/Form/index";
import { Input, Button } from "ant-design-vue";
import { Card } from "ant-design-vue";

export default defineComponent({
  components: {
    BasicForm,
    [Input.name]: Input,
    Button,
    Card,
  },
  setup() {
    const [register, { appendSchemaByField, removeSchemaByField, validate }] =
      useForm({
        schemas: [
          {
            field: "field0a",
            component: "Input",
            label: "字段0",
            colProps: {
              span: 8,
            },
            required: true,
          },
          {
            field: "field0b",
            component: "Input",
            label: "字段0",
            colProps: {
              span: 8,
            },
            required: true,
          },
          {
            field: "0",
            component: "Input",
            label: " ",
            itemProps: {
              colon: false,
            },
            colProps: {
              span: 8,
            },
            slot: "add",
          },
        ],
        labelWidth: 100,
        actionColOptions: { span: 24 },
      });

    async function handleSubmit() {
      try {
        const data = await validate();
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }

    const n = ref(1);

    function add() {
      appendSchemaByField(
        {
          field: `field${n.value}a`,
          component: "Input",
          label: "字段" + n.value,
          colProps: {
            span: 8,
          },
          required: true,
        },
        ""
      );
      appendSchemaByField(
        {
          field: `field${n.value}b`,
          component: "Input",
          label: "字段" + n.value,
          colProps: {
            span: 8,
          },
          required: true,
        },
        ""
      );

      appendSchemaByField(
        {
          field: `${n.value}`,
          component: "Input",
          label: " ",
          colProps: {
            span: 8,
          },
          itemProps: {
            colon: false,
          },
          slot: "add",
        },
        ""
      );
      n.value++;
    }

    function del(field: any) {
      removeSchemaByField([`field${field}a`, `field${field}b`, `${field}`]);
      n.value--;
    }

    return { register, handleSubmit, add, del };
  },
});
</script>
