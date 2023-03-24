<template>
  <Menu
    mode="inline"
    theme="dark"
    :default-open-keys="['FormDemo']"
    @click="handleClick"
  >
    <MenuGroup v-for="menuGroup in BasicRoute" :key="menuGroup.name">
      <span slot="title">
        <Icon
          :type="menuGroup.name === 'FormDemo' ? 'apple' : 'windows'"
          class="mr-1"
        />
        <span>{{ menuGroup.meta.title }}</span>
      </span>
      <MenuItem v-for="menu in menuGroup.children" :key="menu.name">
        {{ menu.meta.title }}
      </MenuItem>
    </MenuGroup>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, Icon } from "ant-design-vue";
import { BasicRoute } from "@/router/index";
import {} from "vue-router";
import { getCurrentInstance } from "vue";
const MenuItem = Menu.Item;
const MenuGroup = Menu.ItemGroup;
const router = getCurrentInstance()?.proxy?.$router;
const handleClick = ({ item, key, keyPath }: Recordable) => {
  // @ts-ignore
  router.push({
    name: key,
  });
};
</script>
<style scoped>
.ant-menu {
  height: calc(100vh - 68px);
  overflow: auto;
}
</style>
