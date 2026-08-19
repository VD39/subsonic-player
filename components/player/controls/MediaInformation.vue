<script setup lang="ts">
import ButtonLink from '@/components/ui/ButtonLink.vue';

const { currentTrack } = useQueue();
const { openTrackDetailsModal } = useMediaInformation();

function onClick() {
  openTrackDetailsModal(currentTrack.value);
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
