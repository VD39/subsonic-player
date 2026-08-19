<script setup lang="ts">
import MainLoader from '@/components/notification/MainLoader.vue';
import ModalWindow from '@/components/notification/ModalWindow.vue';
import SnackBar from '@/components/notification/SnackBar.vue';

const { $pwa, hook } = useNuxtApp();
const { closeModal, openModal } = useModal();
const { isDarkTheme } = useSettings();
const { width } = useSidebar();
const { hasQueueTracks } = useQueue();

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
        hasQueueTracks.value ? 'var(--media-player-height)' : '0px',
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
