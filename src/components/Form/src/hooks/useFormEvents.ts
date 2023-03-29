import type { ComputedRef, Ref } from "vue";
import type {
  FormProps,
  FormSchema,
  FormActionType,
  NamePath,
} from "../types/form";
import { unref, toRaw, nextTick } from "vue";
import {
  isArray,
  isFunction,
  isObject,
  isString,
  isDef,
  isNullOrUnDef,
} from "@/utils/is";
import { deepMerge } from "@/utils";
import {
  dateItemType,
  handleInputNumberValue,
  defaultValueComponents,
} from "../helper";
import { dateUtil } from "@/utils/dateUtil";
import { cloneDeep } from "lodash-es";
import { EmitType, Fn } from "#/index";

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModelStr: Ref<string>;
  defaultValueRef: Ref<Recordable>;
  formElRef: Ref<FormActionType>;
  schemaRef: Ref<FormSchema[]>;
  handleFormValues: Fn;
}
export function useFormEvents({
  emit,
  getProps,
  formModelStr,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
}: UseFormActionContext) {
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());
    const formEl = unref(formElRef);
    if (!formEl) return;
    const formModel = JSON.parse(formModelStr.value);
    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      const isInput =
        schema?.component && defaultValueComponents.includes(schema.component);
      const defaultValue = cloneDeep(defaultValueRef.value[key]);
      formModel[key] = isInput ? defaultValue || "" : defaultValue;
    });
    nextTick(() => {
      clearValidate();
      formModelStr.value = JSON.stringify(formModel);
      // unref(formElRef)?.resetFields();

      emit("reset", toRaw(formModel));
      submitOnReset && handleSubmit();
    });
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue(
    values: Recordable,
    isInit = false
  ): Promise<void> {
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean);

    // key 支持 a.b.c 的嵌套写法
    const delimiter = ".";
    const nestKeyArray = fields.filter((item) => item.indexOf(delimiter) >= 0);
    const formModel = JSON.parse(formModelStr.value);
    const validKeys: string[] = [];
    Object.keys(values).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      let value = values[key];

      const hasKey = Reflect.has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      // 0| '' is allow
      if (hasKey && fields.includes(key)) {
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(value)) {
            const arr: any[] = [];
            for (const ele of value) {
              arr.push(ele ? dateUtil(ele) : null);
            }
            formModel[key] = arr;
          } else {
            const { componentProps } = schema || {};
            let _props = componentProps as any;
            if (typeof componentProps === "function") {
              _props = _props({ formModel });
            }
            formModel[key] = value
              ? _props?.valueFormat
                ? value
                : dateUtil(value)
              : null;
          }
        } else {
          formModel[key] = value;
        }
        validKeys.push(key);
      } else {
        nestKeyArray.forEach((nestKey: string) => {
          try {
            const value = nestKey
              .split(".")
              .reduce((out, item) => out[item], values);
            if (isDef(value)) {
              formModel[nestKey] = value;
              validKeys.push(nestKey);
            }
          } catch (e) {
            // key not exist
            if (isDef(defaultValueRef.value[nestKey])) {
              formModel[nestKey] = cloneDeep(defaultValueRef.value[nestKey]);
            }
          }
        });
      }
    });
    formModelStr.value = JSON.stringify(formModel);
    nextTick(() => {
      if (isInit) return;
      validateField(validKeys).catch((_) => {});
    });
  }
  /**
   * @description: Delete based on field name
   */
  async function removeSchemaByField(fields: string | string[]): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields;
    if (isString(fields)) {
      fieldList = [fields];
    }
    for (const field of fieldList) {
      _removeSchemaByFeild(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFeild(field: string, schemaList: FormSchema[]): void {
    if (isString(field)) {
      const formModel = JSON.parse(formModelStr.value);
      const index = schemaList.findIndex((schema) => schema.field === field);
      if (index !== -1) {
        delete formModel[field];
        schemaList.splice(index, 1);
        formModelStr.value = JSON.stringify(formModel);
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(
    schema: FormSchema,
    prefixField?: string,
    first = false
  ) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));

    const index = schemaList.findIndex(
      (schema) => schema.field === prefixField
    );

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schema) : schemaList.push(schema);
      schemaRef.value = schemaList;
      _setDefaultValue(schema);
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema);
    }
    _setDefaultValue(schema);

    schemaRef.value = schemaList;
  }

  async function resetSchema(
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) =>
        item.component === "Divider" ||
        (Reflect.has(item, "field") && item.field)
    );

    if (!hasField) {
      throw new Error(
        "All children of the form Schema array that need to be updated must contain the `field` field"
      );
    }
    schemaRef.value = updateData as FormSchema[];
  }

  async function updateSchema(
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) =>
        item.component === "Divider" ||
        (Reflect.has(item, "field") && item.field)
    );

    if (!hasField) {
      throw new Error(
        "All children of the form Schema array that need to be updated must contain the `field` field"
      );
    }
    const schema: FormSchema[] = [];
    unref(getSchema).forEach((val) => {
      const item = updateData.find((el) => val.field === el.field);
      if (item) {
        updateData = updateData.filter((el) => el.field !== item.field);
        schema.push(deepMerge(val, item));
      } else {
        schema.push(val);
      }
    });
    _setDefaultValue(schema);
    nextTick(() => {
      schemaRef.value = schema;
    });
  }

  function _setDefaultValue(data: FormSchema | FormSchema[]) {
    let schemas: FormSchema[] = [];
    if (isObject(data)) {
      schemas.push(data as FormSchema);
    }
    if (isArray(data)) {
      schemas = [...data];
    }

    const obj: Recordable = {};
    const currentFieldsValue = getFieldsValue();
    schemas.forEach((item) => {
      if (
        item.component != "Divider" &&
        Reflect.has(item, "field") &&
        item.field &&
        !isNullOrUnDef(item.defaultValue) &&
        !(item.field in currentFieldsValue)
      ) {
        obj[item.field] = item.defaultValue;
      }
    });
    setFieldsValue(obj);
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(toRaw(JSON.parse(formModelStr.value)));
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    return unref(getSchema).some((item) => {
      return item.field === key ? dateItemType.includes(item.component) : false;
    });
  }

  async function validateField(nameList?: NamePath[] | undefined) {
    return new Promise(async (resolve, reject) => {
      if (nameList && nameList.length) {
        const errorMsgArr: string[] = [];
        // @ts-ignore
        unref(formElRef)?.validateField(nameList, (errorMsg: string) => {
          errorMsgArr.push(errorMsg);
          if (errorMsgArr.length === nameList.length) {
            if (errorMsgArr.some((el) => el)) {
              reject(errorMsgArr);
            } else {
              resolve(JSON.parse(formModelStr.value));
            }
          }
        });
      } else {
        const isValidate = await unref(formElRef)?.validate();
        if (isValidate) {
          resolve(JSON.parse(formModelStr.value));
        } else {
          reject(new Error("表单验证不通过"));
        }
      }
    });
  }

  function validate() {
    return new Promise(async (resolve, reject) => {
      const isValidate = await unref(formElRef)?.validate();
      if (isValidate) {
        resolve(JSON.parse(formModelStr.value));
      } else {
        reject(new Error("表单验证不通过"));
      }
    });
  }

  async function clearValidate(name?: string | string[]) {
    await unref(formElRef)?.clearValidate(name);
  }

  async function scrollToField(
    name: NamePath,
    options?: ScrollOptions | undefined
  ) {
    await unref(formElRef)?.scrollToField(name, options);
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit(e?: Event): Promise<void> {
    e && e.preventDefault();
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) return;
    try {
      const values = await validate();
      const res = handleFormValues(values);
      emit("submit", res);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateField,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByField,
    resetFields,
    setFieldsValue,
    scrollToField,
  };
}
