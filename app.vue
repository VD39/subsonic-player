<script setup lang="ts">
import MainLoader from '@/components/Atoms/MainLoader.vue';
import ModalWindow from '@/components/Molecules/ModalWindow.vue';
import SnackBar from '@/components/Molecules/SnackBar.vue';

const nuxtApp = useNuxtApp();
const { isDarkTheme } = useTheme();
const { width } = useSidebar();
const { showMediaPlayer } = useAudioPlayer();

const isLoading = ref(true);

nuxtApp.hook('page:finish', () => {
  isLoading.value = false;
});

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
    <div v-if="isLoading" class="fullscreen centerAll">
      <MainLoader />
    </div>

    <NuxtPage />
    <ModalWindow />
    <SnackBar />
  </NuxtLayout>
</template>
