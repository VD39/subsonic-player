<script setup lang="ts">
import TracklistMixed from '@/components/tracklist/TracklistMixed.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';

const {
  playFromQueue,
  removeFromQueue,
  reorderQueueTrack,
  resetPlayerSession,
} = useAudioPlayer();
const { queueList, resetQueue, toggleQueueList } = useQueue();
const { addToPlaylistModal } = usePlaylist();
const { downloadTrack } = useMediaLibrary();
const { openTrackDetailsModal } = useMediaInformation();

function clearQueue() {
  resetPlayerSession();
  resetQueue();
}
</script>

<template>
  <div
    aria-label="Queue list"
    aria-modal="true"
    class="queueWrapper"
    role="dialog"
    tabindex="-1"
  >
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

    <TracklistMixed
      class="mBXL"
      :tracks="queueList"
      @addToPlaylist="addToPlaylistModal"
      @downloadMedia="downloadTrack"
      @mediaInformation="openTrackDetailsModal"
      @playTrack="playFromQueue"
      @remove="({ index }) => removeFromQueue(index)"
      @sortList="reorderQueueTrack"
    />
  </div>
</template>
