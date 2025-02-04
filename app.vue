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
    <div v-if="isLoading" :class="['centerAll', $style.loader]">
      <MainLoader />
    </div>

    <NuxtPage />
    <ModalWindow />
    <SnackBar />
  </NuxtLayout>
</template>

<style module>
/* TODO: Move to component and use in ModalWindow component. */
.loader {
  --loader-width-height: var(--width-height-100);

  position: fixed;
  inset: 0;
  z-index: 15;
  width: var(--loader-width-height);
  height: var(--loader-width-height);

  &::after {
    position: fixed;
    inset: 0;
    z-index: -1;
    content: '';
    background-color: var(--body-background-color);
    opacity: 0.7;
  }
}
</style>
