<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';

const {
  playFromQueue,
  removeFromQueue,
  reorderQueueTrack,
  resetPlayerSession,
} = useAudioPlayer();
const { queueList, resetQueue, toggleQueueList } = useQueue();
const { addToPlaylistModal } = usePlaylist();
const { downloadTrack } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();

function clearQueue() {
  resetPlayerSession();
  resetQueue();
}
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
      class="mBXL"
      :tracks="queueList"
      @addToPlaylist="addToPlaylistModal"
      @downloadMedia="downloadTrack"
      @mediaInformation="openTrackInformationModal"
      @playTrack="playFromQueue"
      @remove="({ index }) => removeFromQueue(index)"
      @sortList="reorderQueueTrack"
    />
  </div>
</template>
