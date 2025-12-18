<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';

const {
  clearQueue,
  playTrackFromQueueList,
  queueList,
  removeTrackFromQueueList,
} = useAudioPlayer();
const { toggleQueueList } = useQueue();
const { addToPlaylistModal } = usePlaylist();
const { downloadMedia } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();
</script>

<template>
  <div class="queueWrapper">
    <div class="centerAll">
      <ButtonLink
        ref="closeQueueList"
        class="queueAction"
        fullWidth
        :icon="ICONS.queueClose"
        iconWeight="bold"
        title="Close queue list"
        @click="toggleQueueList"
      >
        Close queue list
      </ButtonLink>
    </div>

    <div class="spaceBetween">
      <div />

      <ButtonLink
        ref="clearQueueButton"
        :icon="ICONS.clear"
        title="Clear queue"
        @click="clearQueue"
      >
        Clear queue
      </ButtonLink>
    </div>

    <h2>Queue ({{ queueList.length }})</h2>

    <MixedTracksList
      :tracks="queueList"
      @addToPlaylist="addToPlaylistModal"
      @downloadMedia="downloadMedia"
      @mediaInformation="openTrackInformationModal"
      @playTrack="playTrackFromQueueList"
      @remove="({ id }) => removeTrackFromQueueList(id)"
    />
  </div>
</template>
