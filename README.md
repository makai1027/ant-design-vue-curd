# Q & A

1. vue2 tsx 不支持扩展运算符快速绑定组件属性！！，如何解决？

   > 通过 render 函数绑定 props

   ```tsx
   // 失效案例
   return () => <div {...props} />;

   // 优化案例
   return () =>
     h("div", {
       props,
     });
   ```

2. reactive 初始化未设置 key，使用 object 的动态对象键设置键值，无法触发 watch 以及重新渲染？

> 首先设置一个 ref 字符串对象，每次修改该字符串对象

```ts
const formModelStr = ref("{}");
const formModel = computed(() => JSON.parse(formModelStr.value));

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
```

3. 由于 ant-design-vue1.7.8 不支持 formItem 的 prop 使用 a.b 的格式，所以会出现报错提示，另外则是必填校验无效，请慎重使用
