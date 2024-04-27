<script setup lang="ts">
import ModalWindow from '@/components/Modal/ModalWindow.vue';
import SnackBar from '@/components/SnackBar/SnackBar.vue';

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
    <ModalWindow />
    <SnackBar />
  </NuxtLayout>
</template>
