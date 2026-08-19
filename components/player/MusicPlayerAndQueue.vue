<script setup lang="ts">
import MusicPlayer from '@/components/player/MusicPlayer.vue';
import QueueList from '@/components/player/queue/QueueList.vue';
import QueuePlayer from '@/components/player/queue/QueuePlayer.vue';

const { hasQueueTracks, isQueueListOpened, isQueuePlayerOpened } = useQueue();
</script>

<template>
  <Transition name="slide-up-down">
    <MusicPlayer v-if="hasQueueTracks" />
  </Transition>

  <Transition name="slide-up-down">
    <QueuePlayer v-if="isQueuePlayerOpened" />
  </Transition>

  <Transition name="slide-up-down">
    <QueueList v-show="isQueueListOpened" />
  </Transition>
</template>
