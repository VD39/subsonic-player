<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import QueueList from '@/components/Organisms/QueueList.vue';

const {
  clearQueueList,
  playTrackFromQueueList,
  queueList,
  removeTrackFromQueueList,
} = useAudioPlayer();

useHead({
  title: 'Queue',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Queue ({{ queueList.length }})</h1>

    <template #actions>
      <ButtonLink
        ref="clearQueue"
        :icon="ICONS.clear"
        title="Clear queue"
        @click="clearQueueList"
      >
        Clear queue
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <QueueList
    :tracks="queueList"
    @play-track="playTrackFromQueueList"
    @remove-from-queue="removeTrackFromQueueList"
  />
</template>
