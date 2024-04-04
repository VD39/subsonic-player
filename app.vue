<script setup lang="ts">
const { isDarkTheme } = useTheme();
const { collapsed } = useSidebar();

useHead({
  htmlAttrs: {
    class: {
      dark: () => isDarkTheme.value,
      collapsed: () => collapsed.value,
    },
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
