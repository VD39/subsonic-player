<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import TrackWithPreviewList from '@/components/Organisms/TrackWithPreviewList.vue';

const {
  clearQueueList,
  playTrackFromQueueList,
  queueList,
  removeTrackFromQueueList,
} = useAudioPlayer();
const { toggleQueueList } = useQueue();
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

    <TrackWithPreviewList
      in-queue
      :tracks="queueList"
      @play-track="playTrackFromQueueList"
      @remove-from-queue="removeTrackFromQueueList"
    />
  </div>
</template>
