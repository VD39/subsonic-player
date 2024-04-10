<script setup lang="ts">
const { isDarkTheme } = useTheme();
const { collapsed, width } = useSidebar();

useHead({
  htmlAttrs: {
    class: {
      dark: () => isDarkTheme.value,
      collapsed: () => collapsed.value,
    },
  },
  bodyAttrs: {
    style: {
      '--sidebar-width': width,
    },
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
