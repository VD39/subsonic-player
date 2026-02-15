<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { currentTrack } = useAudioPlayer();
const { openTrackInformationModal } = useMediaInformation();

function onClick() {
  openTrackInformationModal(currentTrack.value);
}
</script>

<template>
  <ButtonLink
    :icon="ICONS.information"
    title="Media information"
    @click="onClick"
  >
    Media information
  </ButtonLink>
</template>
