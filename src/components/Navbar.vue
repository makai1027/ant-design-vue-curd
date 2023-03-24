<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import { routes } from "@/router";

const availableRoutes = routes.filter((route) => route.name !== "NotFound");
const currentRoute = computed(() => getCurrentInstance()?.proxy?.$route);

const isDark = useDark();
const toggle = useToggle(isDark);
</script>

<template>
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
          <MdiWhiteBalanceSunny v-if="isDark" class="text-yellow-500" />
          <MdiMoonWaningCrescent v-else class="text-gray-800" />
        </button>
      </nav>
    </div>
  </header>
</template>
