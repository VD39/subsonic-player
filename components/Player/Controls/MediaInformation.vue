<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { openModal } = useModal();
const { currentTrack } = useAudioPlayer();

function addPlaylistModal() {
  switch (currentTrack.value.type) {
    case 'track':
      openModal('trackDetailsModal', {
        track: currentTrack.value,
      });
      break;
    case 'podcast':
      openModal('podcastDescriptionModal', {
        description: currentTrack.value.description,
      });
      break;
  }
}
</script>

<template>
  <IconButton
    icon="PhInfo"
    title="Episode information"
    @click="addPlaylistModal"
  >
    Episode information
  </IconButton>
</template>
