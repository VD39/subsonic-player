<script setup lang="ts">
import MusicPlayer from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayer/MusicPlayer.vue';
import QueueList from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueueList.vue';
import QueuePlayer from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueuePlayer.vue';

const { hasQueueTracks, isQueueListOpened, isQueuePlayerOpened } = useQueue();
</script>

<template>
  <transition name="slide-up-down">
    <MusicPlayer v-if="hasQueueTracks" />
  </transition>

  <transition name="slide-up-down">
    <QueuePlayer v-if="isQueuePlayerOpened" />
  </transition>

  <transition name="slide-up-down">
    <QueueList v-show="isQueueListOpened" />
  </transition>
</template>
