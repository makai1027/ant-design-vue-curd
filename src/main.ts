import Vue from "vue";
import App from "@/App.vue";

import "windi.css";
import router from "@/router";
import "ant-design-vue/dist/antd.css";
import { Modal } from "ant-design-vue";

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(Modal);
/* eslint-disable no-new */
const instance = new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
