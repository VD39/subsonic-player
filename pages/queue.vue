<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';

const {
  clearQueueList,
  playTrackFromQueueList,
  queueList,
  removeTrackFromQueueList,
} = useAudioPlayer();
const { addToPlaylistModal } = usePlaylist();
const { downloadMedia } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();
const { dragStart } = useDragAndDrop();

useHead({
  title: 'Queue',
});
</script>

<template>
  <HeaderWithAction>
    <h1 ref="title">Queue ({{ queueList.length }})</h1>

    <template #actions>
      <ButtonLink
        ref="clearQueueButton"
        :icon="ICONS.clear"
        title="Clear queue"
        @click="clearQueueList"
      >
        Clear queue
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <MixedTracksList
    :tracks="queueList"
    @addToPlaylist="addToPlaylistModal"
    @downloadMedia="downloadMedia"
    @dragStart="dragStart"
    @mediaInformation="openTrackInformationModal"
    @playTrack="playTrackFromQueueList"
    @remove="({ id }) => removeTrackFromQueueList(id)"
  />
</template>
