<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import QueueList from '@/components/Organisms/QueueList.vue';

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
        :icon="ICONS.queueClose"
        icon-weight="bold"
        title="Close queue list"
        full-width
        class="queueAction"
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

    <QueueList
      :tracks="queueList"
      @play-track="playTrackFromQueueList"
      @remove-from-queue="removeTrackFromQueueList"
    />
  </div>
</template>
