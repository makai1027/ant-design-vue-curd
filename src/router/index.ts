import Vue from "vue";
import type { RouteConfig } from "vue-router";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

Vue.use(VueRouter);
export const BasicRoute = [
  {
    path: "/form",
    name: "FormDemo",
    redirect: "/form/basic",
    component: () => import("@/views/blank.vue"),
    meta: {
      // icon: 'mdi:form-select',
      title: "Form组件",
    },
    children: [
      {
        path: "/form/basic",
        name: "FormBasicDemo",
        component: () => import("@/views/demo/form/index.vue"),
        meta: {
          title: "基础表单",
        },
      },
      {
        path: "/form/useForm",
        name: "UseFormDemo",
        component: () => import("@/views/demo/form/UseForm.vue"),
        meta: {
          title: "useForm",
        },
      },
      {
        path: "/form/refForm",
        name: "RefFormDemo",
        component: () => import("@/views/demo/form/RefForm.vue"),
        meta: {
          title: "refForm",
        },
      },
      {
        path: "/form/advancedForm",
        name: "AdvancedFormDemo",
        component: () => import("@/views/demo/form/AdvancedForm.vue"),
        meta: {
          title: "可收缩表单",
        },
      },
      {
        path: "/form/ruleForm",
        name: "RuleFormDemo",
        component: () => import("@/views/demo/form/RuleForm.vue"),
        meta: {
          title: "表单验证",
        },
      },
      {
        path: "/form/dynamicForm",
        name: "DynamicFormDemo",
        component: () => import("@/views/demo/form/DynamicForm.vue"),
        meta: {
          title: "动态表单",
        },
      },
      {
        path: "/form/customerForm",
        name: "CustomerFormDemo",
        component: () => import("@/views/demo/form/CustomerForm.vue"),
        meta: {
          title: "自定义组件",
        },
      },
      {
        path: "/form/appendForm",
        name: "appendFormDemo",
        component: () => import("@/views/demo/form/AppendForm.vue"),
        meta: {
          title: "表单增删示例",
        },
      },
      {
        path: "/form/tabsForm",
        name: "tabsFormDemo",
        component: () => import("@/views/demo/form/TabsForm.vue"),
        meta: {
          title: "标签页和多节field",
        },
      },
    ],
  },

  {
    path: "/modal",
    name: "ModalDemo",
    component: () => import("@/views/blank.vue"),
    redirect: "",
    meta: {
      title: "弹窗组件",
    },
    children: [
      {
        path: "/modal/base",
        name: "ModalDemobase",
        component: () => import("@/views/demo/modal/index.vue"),
        meta: {
          title: "弹窗组件示例集合",
        },
      },
      {
        path: "/modal/modal1",
        name: "ModalDemo1",
        component: () => import("@/views/demo/modal/Modal1.vue"),
        meta: {
          title: "弹窗组件1",
        },
      },
      {
        path: "/modal/modal2",
        name: "ModalDemo2",
        component: () => import("@/views/demo/modal/Modal2.vue"),
        meta: {
          title: "弹窗组件2",
        },
      },
      {
        path: "/modal/modal3",
        name: "ModalDemo3",
        component: () => import("@/views/demo/modal/Modal3.vue"),
        meta: {
          title: "弹窗组件3",
        },
      },
      {
        path: "/modal/modal4",
        name: "ModalDemo4",
        component: () => import("@/views/demo/modal/Modal4.vue"),
        meta: {
          title: "弹窗组件4",
        },
      },
    ],
  },
  // {
  //   path: "/table",
  //   name: "TableDemo",
  //   redirect: "/table/basic",
  // component: () => import("@/views/blank.vue"),
  //   meta: {
  //     // icon: 'carbon:table-split',
  //     title: "表格Table",
  //   },

  //   children: [
  //     {
  //       path: "/table/basic",
  //       name: "TableBasicDemo",
  //       component: () => import("@/views/demo/table/Basic.vue"),
  //       meta: {
  //         title: "基础表格",
  //       },
  //     },
  //     {
  //       path: "/table/treeTable",
  //       name: "TreeTableDemo",
  //       component: () => import("@/views/demo/table/TreeTable.vue"),
  //       meta: {
  //         title: "树形表格 ",
  //       },
  //     },
  //     {
  //       path: "/table/fetchTable",
  //       name: "FetchTableDemo",
  //       component: () => import("@/views/demo/table/FetchTable.vue"),
  //       meta: {
  //         title: "远程加载表格",
  //       },
  //     },
  //     {
  //       path: "/table/fixedColumn",
  //       name: "FixedColumnDemo",
  //       component: () => import("@/views/demo/table/FixedColumn.vue"),
  //       meta: {
  //         title: "固定列",
  //       },
  //     },
  //     {
  //       path: "/table/customerCell",
  //       name: "CustomerCellDemo",
  //       component: () => import("@/views/demo/table/CustomerCell.vue"),
  //       meta: {
  //         title: "自定义列",
  //       },
  //     },
  //     {
  //       path: "/table/formTable",
  //       name: "FormTableDemo",
  //       component: () => import("@/views/demo/table/FormTable.vue"),
  //       meta: {
  //         title: "开启搜索区域",
  //       },
  //     },
  //     {
  //       path: "/table/useTable",
  //       name: "UseTableDemo",
  //       component: () => import("@/views/demo/table/UseTable.vue"),
  //       meta: {
  //         title: "useTable",
  //       },
  //     },
  //     {
  //       path: "/table/refTable",
  //       name: "RefTableDemo",
  //       component: () => import("@/views/demo/table/RefTable.vue"),
  //       meta: {
  //         title: "refTable",
  //       },
  //     },
  //     {
  //       path: "/table/multipleHeader",
  //       name: "MultipleHeaderDemo",
  //       component: () => import("@/views/demo/table/MultipleHeader.vue"),
  //       meta: {
  //         title: "多级表头",
  //       },
  //     },
  //     {
  //       path: "/table/mergeHeader",
  //       name: "MergeHeaderDemo",
  //       component: () => import("@/views/demo/table/MergeHeader.vue"),
  //       meta: {
  //         title: "合并单元格",
  //       },
  //     },
  //     {
  //       path: "/table/expandTable",
  //       name: "ExpandTableDemo",
  //       component: () => import("@/views/demo/table/ExpandTable.vue"),
  //       meta: {
  //         title: "可展开表格",
  //       },
  //     },
  //     {
  //       path: "/table/fixedHeight",
  //       name: "FixedHeightDemo",
  //       component: () => import("@/views/demo/table/FixedHeight.vue"),
  //       meta: {
  //         title: "固定高度、头部自定义",
  //       },
  //     },
  //     {
  //       path: "/table/footerTable",
  //       name: "FooterTableDemo",
  //       component: () => import("@/views/demo/table/FooterTable.vue"),
  //       meta: {
  //         title: "表尾合计",
  //       },
  //     },
  //     {
  //       path: "/table/editCellTable",
  //       name: "EditCellTableDemo",
  //       component: () => import("@/views/demo/table/EditCellTable.vue"),
  //       meta: {
  //         title: "可编辑单元格",
  //       },
  //     },
  //     {
  //       path: "/table/editRowTable",
  //       name: "EditRowTableDemo",
  //       component: () => import("@/views/demo/table/EditRowTable.vue"),
  //       meta: {
  //         title: "可编辑行数据",
  //       },
  //     },
  //     {
  //       path: "/table/authColumn",
  //       name: "AuthColumnDemo",
  //       component: () => import("@/views/demo/table/AuthColumn.vue"),
  //       meta: {
  //         title: "权限列",
  //       },
  //     },
  //     {
  //       path: "/table/resizeParentHeightTable",
  //       name: "ResizeParentHeightTable",
  //       component: () =>
  //         import("@/views/demo/table/ResizeParentHeightTable.vue"),
  //       meta: {
  //         title: "继承父元素高度",
  //       },
  //     },
  //   ],
  // },
];
export const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: Home,
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  ...BasicRoute,
  {
    path: "/:path(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = new VueRouter({
  base: "/",
  mode: "history",
  routes,
});

export default router;
