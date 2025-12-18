<script setup lang="ts">
import MainLoader from '@/components/Atoms/MainLoader.vue';
import ModalWindow from '@/components/Molecules/ModalWindow.vue';
import SnackBar from '@/components/Molecules/SnackBar.vue';

const { hook } = useNuxtApp();
const { isDarkTheme } = useTheme();
const { width } = useSidebar();
const { showMediaPlayer } = useAudioPlayer();

const loading = ref(true);

hook('page:finish', () => {
  loading.value = false;
});

useHead({
  bodyAttrs: {
    style: {
      '--sidebar-bottom': () =>
        showMediaPlayer.value ? 'var(--media-player-height)' : '0px',
      '--sidebar-width': width,
      '--theme-color': THEME_COLOUR,
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
  <NuxtPwaAssets />

  <NuxtLayout>
    <div v-if="loading" class="fullscreen centerAll">
      <MainLoader />
    </div>

    <NuxtPage />
    <ModalWindow />
    <SnackBar />
  </NuxtLayout>
</template>
