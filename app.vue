<script setup lang="ts">
import ModalWindow from '@/components/Modal/ModalWindow.vue';
import SnackBar from '@/components/SnackBar/SnackBar.vue';

const { isDarkTheme } = useTheme();
const { collapsed, width } = useSidebar();
const { showMediaPlayer } = useAudioPlayer();

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
      '--sidebar-bottom': () =>
        showMediaPlayer.value ? 'var(--media-player-height)' : '0px',
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
