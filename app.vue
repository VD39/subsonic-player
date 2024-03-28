<script setup lang="ts">
const { isDarkTheme } = useTheme();

useHead({
  htmlAttrs: {
    class: {
      dark: () => isDarkTheme.value,
      light: () => !isDarkTheme.value,
    },
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
