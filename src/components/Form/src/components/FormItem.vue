<script lang="tsx">
import type { PropType, Ref } from "vue";
import { computed, defineComponent, toRefs, unref, h, watch } from "vue";
import type { FormActionType, FormProps, FormSchema } from "../types/form";
import type { ValidationRule } from "ant-design-vue/types/form-model/form";
import type { TableActionType } from "@/components/Table";
import { Col, Divider, FormModel as Form } from "ant-design-vue";
import { componentMap } from "../componentMap";
import { BasicHelp } from "@/components/Basic";
import { isBoolean, isFunction, isNull } from "@/utils/is";
import { getSlot } from "@/utils/tsxHelper";
import { createPlaceholderMessage, setComponentRuleType } from "../helper";
import { useItemLabelWidth } from "../hooks/useLabelWidth";
import cloneDeep from "lodash-es/cloneDeep";
import lowerFirst from "lodash-es/lowerFirst";
import upperFirst from "lodash-es/upperFirst";
import has from "lodash-es/has";

export default defineComponent({
  name: "BasicFormItem",
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({}),
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: () => ({}),
    },
    allDefaultValues: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    setFormModel: {
      type: Function as PropType<(key: string, value: any) => void>,
      default: null,
    },
    tableAction: {
      type: Object as PropType<TableActionType>,
    },
    formActionType: {
      type: Object as PropType<FormActionType>,
    },
    isAdvanced: {
      type: Boolean,
    },
  },
  setup(props, { slots }) {
    const { schema, formProps } = toRefs(props) as {
      schema: Ref<FormSchema>;
      formProps: Ref<FormProps>;
    };
    const itemLabelWidthProp = useItemLabelWidth(schema, formProps);
    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props;
      const { mergeDynamicData } = props.formProps;
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...mergeDynamicData,
          ...allDefaultValues,
          ...formModel,
        } as Recordable,
        schema: schema,
      };
    });

    const getComponentsProps = computed(() => {
      const { schema, tableAction, formModel, formActionType } = props;
      let { componentProps = {} } = schema;
      if (isFunction(componentProps)) {
        componentProps =
          componentProps({
            schema,
            tableAction,
            formModel: toReactive(formModel),
            formActionType,
          }) ?? {};
      }
      if (schema.component === "Divider") {
        componentProps = Object.assign({ type: "horizontal" }, componentProps, {
          orientation: "left",
          plain: true,
        });
      }
      return componentProps as Recordable;
    });

    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps;
      const { dynamicDisabled } = props.schema;
      const { disabled: itemDisabled = false } = unref(getComponentsProps);
      let disabled = !!globDisabled || itemDisabled;
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled;
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues));
      }
      return disabled;
    });

    function getShow(): { isShow: boolean; isIfShow: boolean } {
      const { show, ifShow } = props.schema;
      const { showAdvancedButton } = props.formProps;
      const itemIsAdvanced = showAdvancedButton
        ? isBoolean(props.isAdvanced)
          ? props.isAdvanced
          : true
        : true;

      let isShow = true;
      let isIfShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues));
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues));
      }
      isShow = isShow && itemIsAdvanced;
      return { isShow, isIfShow };
    }

    function handleRules(): ValidationRule[] {
      const {
        rules: defRules = [],
        component,
        rulesMessageJoinLabel,
        label,
        dynamicRules,
        required,
      } = props.schema;

      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues)) as ValidationRule[];
      }

      let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[];
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } =
        props.formProps;

      const joinLabel = has(props.schema, "rulesMessageJoinLabel")
        ? rulesMessageJoinLabel
        : globalRulesMessageJoinLabel;
      const defaultMsg =
        createPlaceholderMessage(component) + `${joinLabel ? label : ""}`;

      function validator(rule: any, value: any) {
        const msg = rule.message || defaultMsg;
        if (value === undefined || isNull(value)) {
          // 空值
          return Promise.reject(msg);
        } else if (Array.isArray(value) && value.length === 0) {
          // 数组类型
          return Promise.reject(msg);
        } else if (typeof value === "string" && value.trim() === "") {
          // 空字符串
          return Promise.reject(msg);
        } else if (
          typeof value === "object" &&
          has(value, "checked") &&
          has(value, "halfChecked") &&
          Array.isArray(value.checked) &&
          Array.isArray(value.halfChecked) &&
          value.checked.length === 0 &&
          value.halfChecked.length === 0
        ) {
          // 非关联选择的tree组件
          return Promise.reject(msg);
        }
        return Promise.resolve();
      }

      const getRequired = isFunction(required)
        ? required(unref(getValues))
        : required;

      /*
       * 1、若设置了required属性，又没有其他的rules，就创建一个验证规则；
       * 2、若设置了required属性，又存在其他的rules，则只rules中不存在required属性时，才添加验证required的规则
       *     也就是说rules中的required，优先级大于required
       */
      if (getRequired) {
        if (!rules || rules.length === 0) {
          rules = [{ required: getRequired, validator }];
        } else {
          const requiredIndex: number = rules.findIndex((rule) =>
            has(rule, "required")
          );

          if (requiredIndex === -1) {
            rules.push({ required: getRequired, validator });
          }
        }
      }

      const requiredRuleIndex: number = rules.findIndex(
        (rule) => has(rule, "required") && !has(rule, "validator")
      );

      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex];
        const { isShow } = getShow();
        if (!isShow) {
          rule.required = false;
        }
        if (component) {
          if (!has(rule, "type")) {
            rule.type = component === "InputNumber" ? "number" : "string";
          }

          rule.message = rule.message || defaultMsg;

          if (component.includes("Input") || component.includes("Textarea")) {
            rule.whitespace = true;
          }
          const valueFormat = unref(getComponentsProps)?.valueFormat;
          setComponentRuleType(rule, component, valueFormat);
        }
      }

      // Maximum input length rule check
      const characterInx = rules.findIndex((val) => val.max);
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message =
          rules[characterInx].message ||
          `字符数应小于${[rules[characterInx].max]}位`;
      }
      return rules;
    }

    function renderComponent() {
      const {
        renderComponentContent,
        component,
        field,
        changeEvent = "change",
        valueField,
      } = props.schema;

      const isCheck = component && ["Switch", "Checkbox"].includes(component);
      const eventKey = `${lowerFirst(changeEvent)}`;
      const propEventKey = `on${upperFirst(changeEvent)}`;
      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          if (propsData[propEventKey] && isFunction(propsData[propEventKey])) {
            propsData[propEventKey](...args);
          }
          const [e] = args;
          const target = e ? e.target : null;
          const value = target ? (isCheck ? target.checked : target.value) : e;
          props.setFormModel(field, value);
        },
      };
      const Comp = componentMap.get(component) as ReturnType<
        typeof defineComponent
      >;

      const { autoSetPlaceHolder, size } = props.formProps;
      const propsData: Recordable = {
        allowClear: true,
        getPopupContainer: (trigger: Element) => trigger.parentNode,
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable),
      };

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
      // RangePicker place is an array
      if (isCreatePlaceholder && component !== "RangePicker" && component) {
        propsData.placeholder =
          unref(getComponentsProps)?.placeholder ||
          createPlaceholderMessage(component);
      }
      propsData.codeField = field;
      propsData.formValues = unref(getValues);
      const bindValue: Recordable = {
        [valueField || (isCheck ? "checked" : "value")]: props.formModel[field],
        [valueField || (isCheck ? "modelChecked" : "modelValue")]:
          props.formModel[field],
      };

      const compAttr: Recordable = {
        props: {
          ...bindValue,
          ...propsData,
        },
        on,
      };

      if (!renderComponentContent) {
        // vue2 tsx 不支持扩展运算符绑定属性，
        return h(Comp, compAttr);
      }
      const compSlot: Recordable = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent,
          };
      // vue2 h 函数 可以使用scopedSlots
      // https://v2.cn.vuejs.org/v2/guide/render-function.html#%E6%8F%92%E6%A7%BD
      return h(Comp, { ...compAttr, scopedSlots: compSlot });
    }

    function renderLabelHelpMessage() {
      const { label, helpMessage, helpComponentProps, subLabel } = props.schema;
      const renderLabel = subLabel ? (
        <span>
          {label} <span class="text-secondary">{subLabel}</span>
        </span>
      ) : (
        label
      );
      const getHelpMessage = isFunction(helpMessage)
        ? helpMessage(unref(getValues))
        : helpMessage;
      if (
        !getHelpMessage ||
        (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)
      ) {
        return renderLabel;
      }

      return h("span", {}, [
        renderLabel,
        h(BasicHelp, {
          class: "mx-1",
          props: {
            placement: "top",
            text: getHelpMessage,
            ...helpComponentProps,
          },
        }),
      ]);
    }

    function renderItem() {
      const { itemProps, slot, render, field, suffix, component } =
        props.schema;
      const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
      const { colon } = props.formProps;
      // ；利用浅拷贝
      const scopedValues = toReactive({ ...getValues.value });
      if (component === "Divider") {
        return h(Divider, { props: unref(getComponentsProps) }, [
          renderLabelHelpMessage(),
        ]);
      } else {
        const getContent = () => {
          return slot
            ? getSlot(slots, slot, unref(getValues))
            : render
            ? render(scopedValues)
            : renderComponent();
        };

        const showSuffix = !!suffix;
        const getSuffix = isFunction(suffix)
          ? suffix(unref(getValues))
          : suffix;

        watch(
          () => scopedValues,
          (val) => {
            const { field, model } = val;
            props.setFormModel(field, model[field]);
          },
          { deep: true }
        );
        return h(
          Form.Item,
          {
            props: {
              prop: field,
              colon: colon,
              class: { "suffix-item": showSuffix },
              ...(itemProps as Recordable),
              label: renderLabelHelpMessage(),
              rules: handleRules(),
              labelCol: labelCol,
              wrapperCol: wrapperCol,
            },
          },
          [
            h("div", { style: { display: "flex" } }, [
              h("div", { style: { flex: 1 } }, [getContent()]),
              showSuffix && h("span", { class: "suffix" }, getSuffix as any),
            ]),
          ]
        );
      }
    }

    return () => {
      const {
        colProps = {},
        colSlot,
        renderColContent,
        component,
      } = props.schema;
      if (!componentMap.has(component)) {
        return null;
      }

      const { baseColProps = {} } = props.formProps;
      const realColProps = { ...baseColProps, ...colProps };
      const { isIfShow, isShow } = getShow();
      const values = unref(getValues);

      const getContent = () => {
        return colSlot
          ? getSlot(slots, colSlot, values)
          : renderColContent
          ? renderColContent(values)
          : renderItem();
      };

      return (
        isIfShow &&
        h(
          Col,
          {
            props: realColProps,
            style: {
              display: isShow ? "" : "none",
            },
          },
          [getContent()]
        )
      );
    };
  },
});
</script>
