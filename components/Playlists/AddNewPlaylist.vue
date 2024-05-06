<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { collapsed } = useSidebar();
const { createPlaylist } = usePlaylist();
const { closeModal, openModal } = useModal();

function addPlaylistModal() {
  openModal('addPlaylistModal', {
    /* istanbul ignore next -- @preserve */
    async onSubmit(playlistName: string) {
      await createPlaylist(playlistName);
      closeModal();
    },
  });
}
</script>

<template>
  <IconButton
    icon="plus-circle"
    :class="$style.link"
    :show-text="!collapsed"
    title="Add playlist"
    full-width
    @click="addPlaylistModal"
  >
    Add playlist
  </IconButton>
</template>

<style module>
.link {
  @mixin sidebar-link;
}
</style>
