# Modal 弹窗

对 antv 的 modal 组件进行封装，扩展拖拽，全屏，自适应高度等功能

## Usage

**由于弹窗内代码一般作为单文件组件存在，也推荐这样做，所以示例都为单文件组件形式**

::: tip

注意 `v-bind="$attrs"`记得写，用于将弹窗组件的 `attribute` 传入 `BasicModal` 组件

:::

> 示例一

```vue
<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      ref="basicModal"
      destroyOnClose
      title="Modal Title"
      :helpMessage="['提示1', '提示2']"
      @visible-change="handleShow"
    >
      <template #insertFooter>
        <Button type="primary" danger @click="setLines" :disabled="loading"
          >点我更新内容</Button
        >
      </template>
      <template v-if="loading">
        <div class="empty-tips">加载中，稍等3秒……</div>
      </template>
      <template v-if="!loading">
        <ul>
          <li v-for="index in lines" :key="index">加载完成{{ index }}！</li>
        </ul>
      </template>
    </BasicModal>

    <Button @click="openModal">点击显示</Button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { BasicModal, ModalProps } from "@/components/Modal";
import { Button } from "ant-design-vue";
export default defineComponent({
  components: { BasicModal, Button },
  setup() {
    const loading = ref(true);
    const lines = ref(10);
    const basicModal = ref();

    const setModalProps = (params: Partial<ModalProps>) => {
      basicModal.value.setModalProps(params);
    };
    const redoModalHeight = () => {
      basicModal.value.redoModalHeight();
    };
    watch(
      () => lines.value,
      () => {
        redoModalHeight();
      }
    );

    function handleShow(visible: boolean) {
      if (visible) {
        loading.value = true;
        setModalProps({ loading: true, confirmLoading: true });
        setTimeout(() => {
          lines.value = Math.round(Math.random() * 60 + 5);
          loading.value = false;
          setModalProps({ loading: false, confirmLoading: false });
        }, 3000);
      }
    }

    function setLines() {
      lines.value = Math.round(Math.random() * 20 + 10);
    }

    const openModal = () => {
      setModalProps({
        visible: true,
      });
    };
    return { basicModal, loading, handleShow, lines, setLines, openModal };
  },
});
</script>
<style scoped>
.empty-tips {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
```

> 示例 2

```vue
<template>
  <div>
    <BasicModal
      :visible.sync="visible"
      v-bind="attrs"
      wrapClassName="wrapClassName"
      title="Modal Title3333333"
      :helpMessage="['提示1', '提示2']"
      width="700px"
    >
      <p class="h-20" v-for="index in 20" :key="index">根据屏幕高度自适应</p>
    </BasicModal>
    <a-button @click="toggleModal">显示隐藏弹窗</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BasicModal } from "@/components/Modal";
import { Button } from "ant-design-vue";
export default defineComponent({
  name: "Modal3",
  components: { BasicModal, [Button.name]: Button },
  setup(props, { attrs }) {
    const visible = ref(false);
    const toggleModal = () => {
      visible.value = !visible.value;
    };
    return {
      attrs,
      visible,
      toggleModal,
    };
  },
});
</script>
```

**setModalProps**

用于更改 modal 的 props 参数因为 modal 内容独立成组件，如果在外部页面需要更改 props 可能比较麻烦，所以提供 **setModalProps** 方便更改内部 modal 的 props

[Props](#Props) 内容可以见下方

```ts
this.$refs.basicModal.setModalProps(props);
```

## Props

::: tip

除以下参数外，组件库文档内的 props 也都支持，具体可以参考 [antv modal](https://2x.antdv.com/components/modal-cn/#API)

:::

| 属性                | 类型                     | 默认值   | 可选值     | 说明                                                                                         |
| ------------------- | ------------------------ | -------- | ---------- | -------------------------------------------------------------------------------------------- |
| title               | `string`                 | -        | -          | modal 标题                                                                                   |
| height              | `number`                 | -        | -          | 固定 modal 的高度                                                                            |
| minHeight           | `number`                 | -        | -          | 设置 modal 的最小高度                                                                        |
| draggable           | `boolean`                | true     | true/false | 是否开启拖拽                                                                                 |
| useWrapper          | `boolean`                | true     | true/false | 是否开启自适应高度，开启后会跟随屏幕变化自适应内容，并出现滚动条                             |
| wrapperFooterOffset | `number`                 | 0        | -          | 开启是适应高度后，如果超过屏幕高度，底部和顶部会保持一样的间距，该参数可以用来缩小底部的间距 |
| canFullscreen       | `boolean`                | true     | true/false | 是否可以进行全屏                                                                             |
| defaultFullscreen   | `boolean`                | false    | true/false | 默认全屏                                                                                     |
| loading             | `boolean`                | false    | true/false | loading 状态                                                                                 |
| loadingTip          | `string`                 | -        | -          | loading 文本                                                                                 |
| showCancelBtn       | `boolean`                | true     | true/false | 显示关闭按钮                                                                                 |
| showOkBtn           | `boolean`                | true     | true/false | 显示确认按钮                                                                                 |
| helpMessage         | `string , string[]`      | -        | -          | 标题右侧提示文本                                                                             |
| centered            | `boolean`                | false    | true/false | 是否居中弹窗                                                                                 |
| cancelText          | `string`                 | '关闭'   | -          | 关闭按钮文本                                                                                 |
| okText              | `string`                 | '保存'   | -          | 确认按钮文本                                                                                 |
| closeFunc           | `() => Promise<boolean>` | 关闭函数 | -          | 关闭前执行，返回 true 则关闭，否则不关闭                                                     |

## Events

| 事件           | 回调参数                | 说明             |
| -------------- | ----------------------- | ---------------- |
| ok             | `function(e)`           | 点击确定回调     |
| cancel         | `function(e)`           | 点击取消回调     |
| visible-change | `(visible:boolean)=>{}` | 打开或者关闭触发 |

## Slots

| 名称         | 说明                                               |
| ------------ | -------------------------------------------------- |
| default      | 默认区域                                           |
| footer       | 底部区域(会替换掉默认的按钮)                       |
| insertFooter | 关闭按钮的左边(不使用 footer 插槽时有效)           |
| centerFooter | 关闭按钮和确认按钮的中间(不使用 footer 插槽时有效) |
| appendFooter | 确认按钮的右边(不使用 footer 插槽时有效)           |
