<script setup lang="ts">
import ModalWindow from '@/components/Molecules/ModalWindow.vue';
import SnackBar from '@/components/Molecules/SnackBar.vue';

const { isDarkTheme } = useTheme();
const { width } = useSidebar();
const { showMediaPlayer } = useAudioPlayer();

useHead({
  bodyAttrs: {
    style: {
      '--sidebar-bottom': () =>
        showMediaPlayer.value ? 'var(--media-player-height)' : '0px',
      '--sidebar-width': width,
    },
  },
  htmlAttrs: {
    class: {
      dark: () => isDarkTheme.value,
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
