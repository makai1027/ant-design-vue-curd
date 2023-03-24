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

> 通过$forceUpdate
