<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';

const {
  clearQueueList,
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
        full-width
        :icon="ICONS.queueClose"
        icon-weight="bold"
        title="Close queue list"
        @click="toggleQueueList"
      >
        Close queue list
      </ButtonLink>
    </div>

    <div class="spaceBetween">
      <div />

      <ButtonLink
        ref="clearQueue"
        :icon="ICONS.clear"
        title="Clear queue"
        @click="clearQueueList"
      >
        Clear queue
      </ButtonLink>
    </div>

    <h2>Queue ({{ queueList.length }})</h2>

    <MixedTracksList
      :tracks="queueList"
      @add-to-playlist="addToPlaylistModal"
      @download-media="downloadMedia"
      @media-information="openTrackInformationModal"
      @play-track="playTrackFromQueueList"
      @remove="({ id }) => removeTrackFromQueueList(id)"
    />
  </div>
</template>
