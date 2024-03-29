<template>
  <Form
    v-bind="getBindValue"
    :class="getFormClass"
    ref="formElRef"
    :model.sync="formModel"
    @keydown.native="handleEnterPress"
  >
    <Row class="form-row" v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema">
        <FormItem
          :key="schema.field"
          :isAdvanced="fieldsIsAdvancedMap[schema.field]"
          :tableAction="tableAction"
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
          :formModel="formModel"
          :setFormModel="setFormModel"
        >
          <template #[item]="data" v-for="item in Object.keys(slots)">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>

      <FormAction
        v-bind="getFormActionBindProps"
        @toggle-advanced="handleToggleAdvanced"
      >
        <template
          #[item]="data"
          v-for="item in [
            'resetBefore',
            'submitBefore',
            'advanceBefore',
            'advanceAfter',
          ]"
        >
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </FormAction>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>
<script lang="ts">
import type { FormActionType, FormProps, FormSchema } from "./types/form";
import type { AdvanceState } from "./types/hooks";
import type { Ref } from "vue";
import {
  defineComponent,
  ref,
  computed,
  unref,
  onMounted,
  watch,
  nextTick,
  reactive,
} from "vue";
import { FormModel as Form, Row } from "ant-design-vue";
import FormItem from "./components/FormItem.vue";
import FormAction from "./components/FormAction.vue";
import { dateItemType } from "./helper";
import { dateUtil } from "@/utils/dateUtil";
import { deepMerge, useDesign } from "@/utils";
import { useFormValues } from "./hooks/useFormValues";
import useAdvanced from "./hooks/useAdvanced";
import { useFormEvents } from "./hooks/useFormEvents";
import { createFormContext } from "./hooks/useFormContext";
import { useAutoFocus } from "./hooks/useAutoFocus";
// import { useModalContext } from "@/components/Modal";
import { useDebounceFn } from "@vueuse/core";
import { basicProps } from "./props";
import cloneDeep from "lodash-es/cloneDeep";

export default defineComponent({
  name: "BasicForm",
  components: { Form, Row, FormItem, FormAction },
  props: basicProps,
  emits: [
    "advanced-change",
    "reset",
    "submit",
    "register",
    "field-value-change",
  ],
  setup(props, { emit, attrs, slots }) {
    const formModelStr = ref("{}");
    const formModel = computed(() => JSON.parse(formModelStr.value));
    // const modalFn = useModalContext();

    const advanceState = reactive<AdvanceState>({
      isAdvanced: true,
      hideAdvanceBtn: false,
      isLoad: false,
      actionSpan: 6,
    });

    const defaultValueRef = ref<Recordable>({});
    const isInitedDefaultRef = ref(false);
    const propsRef = ref<Partial<FormProps>>({});
    const schemaRef = ref<Nullable<FormSchema[]>>(null);
    const formElRef = ref<Nullable<FormActionType>>(null);

    const { prefixCls } = useDesign("basic-form");

    // Get the basic configuration of the form
    const getProps = computed((): FormProps => {
      return deepMerge(props, propsRef.value);
    });

    const getFormClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact,
        },
      ];
    });

    // Get uniform row style and Row configuration for the entire form
    const getRow = computed((): Recordable => {
      const { baseRowStyle = {}, rowProps } = unref(getProps);
      return {
        style: baseRowStyle,
        ...rowProps,
      };
    });

    const getBindValue = computed(
      () => ({ ...attrs, ...props, ...unref(getProps) } as Recordable)
    );

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] =
        unref(schemaRef) || (unref(getProps).schemas as any);
      for (const schema of schemas) {
        const {
          defaultValue,
          component,
          isHandleDateDefaultValue = true,
        } = schema;
        // handle date type
        if (
          isHandleDateDefaultValue &&
          defaultValue &&
          dateItemType.includes(component)
        ) {
          if (!Array.isArray(defaultValue)) {
            schema.defaultValue = dateUtil(defaultValue);
          } else {
            const def: any[] = [];
            defaultValue.forEach((item) => {
              def.push(dateUtil(item));
            });
            schema.defaultValue = def;
          }
        }
      }
      return cloneDeep(schemas as FormSchema[]);
    });

    const { handleToggleAdvanced, fieldsIsAdvancedMap } = useAdvanced({
      advanceState,
      // @ts-ignore
      emit,
      getProps,
      getSchema,
      formModel: formModel.value,
      defaultValueRef,
    });

    const { handleFormValues, initDefault } = useFormValues({
      getProps,
      defaultValueRef,
      getSchema,
      formModelStr,
    });

    useAutoFocus({
      getSchema,
      getProps,
      isInitedDefault: isInitedDefaultRef,
      formElRef: formElRef as Ref<FormActionType>,
    });

    const {
      handleSubmit,
      setFieldsValue,
      clearValidate,
      validate,
      validateField,
      getFieldsValue,
      updateSchema,
      resetSchema,
      appendSchemaByField,
      removeSchemaByField,
      resetFields,
      scrollToField,
    } = useFormEvents({
      // @ts-ignore
      emit,
      getProps,
      formModelStr,
      getSchema,
      defaultValueRef,
      formElRef: formElRef as Ref<FormActionType>,
      schemaRef: schemaRef as Ref<FormSchema[]>,
      handleFormValues,
    });

    createFormContext({
      resetAction: resetFields,
      submitAction: handleSubmit,
    });

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps);
        if (!model) return;
        setFieldsValue(model, true);
      },
      {
        immediate: true,
      }
    );

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? []);
      }
    );

    watch(
      () => getSchema.value,
      (schema) => {
        console.log(schema, "????????????");
        nextTick(() => {
          //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
          // modalFn?.redoModalHeight?.();
        });
        if (unref(isInitedDefaultRef)) {
          return;
        }
        if (schema?.length) {
          nextTick(() => {
            initDefault();
            isInitedDefaultRef.value = true;
          });
        }
      }
    );

    watch(
      () => formModel.value,
      useDebounceFn(() => {
        unref(getProps).submitOnChange && handleSubmit();
      }, 300),
      { deep: true }
    );

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
    }
    // 修改某一个值
    function setFormModel(key: string, value: any) {
      const _form = JSON.parse(formModelStr.value);
      _form[key] = value;
      formModelStr.value = JSON.stringify(_form);
      const { validateTrigger } = unref(getBindValue);
      if (!validateTrigger || validateTrigger === "change") {
        validateField([key]).catch((_) => {});
      }
      emit("field-value-change", key, value);
    }

    function handleEnterPress(e: KeyboardEvent) {
      const { autoSubmitOnEnter } = unref(getProps);
      if (!autoSubmitOnEnter) return;
      if (e.key === "Enter" && e.target && e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target as HTMLElement;
        if (
          target &&
          target.tagName &&
          target.tagName.toUpperCase() == "INPUT"
        ) {
          handleSubmit();
        }
      }
    }

    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      updateSchema,
      resetSchema,
      setProps,
      removeSchemaByField,
      appendSchemaByField,
      clearValidate,
      validateField,
      validate,
      submit: handleSubmit,
      scrollToField: scrollToField,
    };

    onMounted(() => {
      initDefault();
      emit("register", formActionType);
    });

    return {
      getBindValue,
      handleToggleAdvanced,
      handleEnterPress,
      formModel,
      defaultValueRef,
      advanceState,
      getRow,
      getProps,
      formElRef,
      getSchema,
      formActionType: formActionType as any,
      setFormModel,
      getFormClass,
      getFormActionBindProps: computed(
        (): Recordable => ({ ...getProps.value, ...advanceState })
      ),
      fieldsIsAdvancedMap,
      ...formActionType,
      slots,
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~"@{namespace}-basic-form";

.@{prefix-cls} {
  .form-row {
    display: flex;
    flex-flow: wrap;
  }
  .ant-form-item {
    display: flex;
    flex-flow: row wrap;

    &-label label::after {
      margin: 0 6px 0 2px;
    }

    &-with-help {
      margin-bottom: 0;
    }

    &:not(.ant-form-item-with-help) {
      margin-bottom: 20px;
    }

    &.suffix-item {
      .ant-form-item-children {
        display: flex;
      }

      .ant-form-item-control {
        margin-top: 4px;
      }

      .suffix {
        display: inline-flex;
        padding-left: 6px;
        margin-top: 1px;
        line-height: 1;
        align-items: center;
      }
    }
  }

  .ant-form-explain {
    font-size: 14px;
  }

  &--compact {
    .ant-form-item {
      margin-bottom: 8px !important;
    }
  }

  .ant-form-item-control:first-child:not([class^="ant-col-"]):not(
      [class*=" ant-col-"]
    ) {
    width: 100%;
  }

  .ant-form-horizontal .ant-form-item-control-wrapper {
    flex: 1 1 0;
    min-width: 0;
  }

  .ant-form-item-control-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
}
</style>
