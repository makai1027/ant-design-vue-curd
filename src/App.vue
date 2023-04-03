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
          <Menu
            mode="inline"
            theme="dark"
            :default-open-keys="['FormDemo']"
            @click="handleClick"
          >
            <MenuGroup v-for="menuGroup in BasicRoute" :key="menuGroup.name">
              <span slot="title">
                <span>{{ menuGroup.meta.title }}</span>
              </span>
              <MenuItem v-for="menu in menuGroup.children" :key="menu.name">
                {{ menu.meta.title }}
              </MenuItem>
            </MenuGroup>
          </Menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0">
            <header class="text-gray-600 body-font dark:bg-gray-800">
              <div
                class="container flex flex-col flex-wrap items-center px-2 py-1 mx-auto md:flex-row h-[64px]"
              >
                <div class="flex-1"></div>
                <nav
                  class="flex flex-wrap items-center justify-center text-base md:ml-auto"
                >
                  <RouterLink
                    class="flex items-center justify-center mr-2 text-black w-9 h-9 dark:text-white"
                    to="/aliens"
                  >
                    <MdiAlien />
                  </RouterLink>
                  <a
                    href="https://github.com/lstoeferle/vite-vue2-windicss-starter"
                    target="_blank"
                    class="flex items-center justify-center mr-2 text-black w-9 h-9 dark:text-white"
                  >
                    <MdiGithub />
                  </a>
                  <button
                    class="flex items-center justify-center w-9 h-9 focus:outline-none"
                    @click="toggle()"
                  >
                    <MdiWhiteBalanceSunny
                      v-if="isDark"
                      class="text-yellow-500"
                    />
                    <MdiMoonWaningCrescent v-else class="text-gray-800" />
                  </button>
                </nav>
              </div>
            </header>
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
import { defineComponent, getCurrentInstance, ref } from "vue";
import { Layout, ConfigProvider } from "ant-design-vue";
import { Menu, Icon } from "ant-design-vue";
import { BasicRoute } from "@/router/index";

export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Sider.name]: Layout.Sider,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    ConfigProvider,
    Menu,
    MenuItem: Menu.Item,
    MenuGroup: Menu.ItemGroup,
  },
  emits: ["change"],
  setup() {
    // Import config from .env
    const collapsed = ref(false);
    const appName = import.meta.env.VITE_APP_NAME;
    const router = getCurrentInstance()?.proxy?.$router;

    const handleClick = ({ item, key, keyPath }: Recordable) => {
      // @ts-ignore
      router.push({
        name: key,
      });
    };
    const isDark = useDark();
    const toggle = useToggle(isDark);
    return {
      BasicRoute,
      appName,
      collapsed,
      isDark,
      toggle,
      handleClick,
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
