<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { openModal } = useModal();
const { currentTrack } = useAudioPlayer();

function openTrackInformationModal() {
  switch (currentTrack.value.type) {
    case 'track':
      openModal('trackDetailsModal', {
        track: currentTrack.value,
      });
      break;
    case 'podcast':
      openModal('podcastEpisodeDescriptionModal', {
        description: (currentTrack.value as PodcastEpisode).description,
      });
      break;
  }
}
</script>

<template>
  <IconButton
    icon="PhInfo"
    title="Episode information"
    @click="openTrackInformationModal"
  >
    Episode information
  </IconButton>
</template>
