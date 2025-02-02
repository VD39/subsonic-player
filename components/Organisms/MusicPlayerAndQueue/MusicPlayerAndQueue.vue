<script setup lang="ts">
import MusicPlayer from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayer/MusicPlayer.vue';
import QueueList from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueueList.vue';
import QueuePlayer from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueuePlayer.vue';

const { showMediaPlayer } = useAudioPlayer();
const { isQueueListOpened, isQueuePlayerOpened } = useQueue();
</script>

<template>
  <transition name="slide-up-down">
    <MusicPlayer v-if="showMediaPlayer" />
  </transition>

  <transition name="slide-up-down">
    <QueuePlayer v-if="isQueuePlayerOpened" />
  </transition>

  <transition name="slide-up-down">
    <QueueList v-if="isQueueListOpened" />
  </transition>
</template>
