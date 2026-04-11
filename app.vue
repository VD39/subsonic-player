<script setup lang="ts">
import MainLoader from '@/components/Atoms/MainLoader.vue';
import ModalWindow from '@/components/Molecules/ModalWindow.vue';
import SnackBar from '@/components/Molecules/SnackBar.vue';

const { $pwa, hook } = useNuxtApp();
const { closeModal, openModal } = useModal();
const { isDarkTheme } = useTheme();
const { width } = useSidebar();
const { showMediaPlayer } = useAudioPlayer();

const loading = ref(true);

hook('page:finish', () => {
  loading.value = false;
});

watch(
  () => $pwa?.needRefresh,
  (needRefresh) => {
    if (needRefresh) {
      openModal(MODAL_TYPE.appUpdateModal, {
        onDismiss() {
          closeModal();
        },
        onModalClose() {
          $pwa?.cancelPrompt();
        },
        onUpdate() {
          $pwa?.updateServiceWorker(true);
        },
      });
    }
  },
);

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
