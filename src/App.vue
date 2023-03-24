<template>
  <div id="app">
    <ConfigProvider size="small">
      <a-layout
        id="components-layout-demo-custom-trigger"
        class="h-full w-full"
      >
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
          <div class="logo py-4">
            <RouterLink
              :to="{ name: 'Home' }"
              class="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
            >
              <img alt="Vite logo" src="@/assets/vite-logo.svg" width="36px" />
              <span class="ml-3 text-xl text-white">
                {{ appName }}
              </span>
            </RouterLink>
          </div>
          <AppMenus />
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0">
            <Navbar />
          </a-layout-header>
          <a-layout-content class="p-2 m-2 bg-white">
            <RouterView />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </ConfigProvider>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { Layout, ConfigProvider } from "ant-design-vue";
export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Sider.name]: Layout.Sider,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    ConfigProvider,
  },
  setup() {
    // Import config from .env
    const collapsed = ref(false);
    const appName = import.meta.env.VITE_APP_NAME;
    return {
      appName,
      collapsed,
    };
  },
});
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
