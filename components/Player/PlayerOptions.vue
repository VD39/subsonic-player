<script setup lang="ts">
import FavouriteButton from '@/components/Buttons/FavouriteButton.vue';
import VolumeControl from './Controls/VolumeControl.vue';
import PlaybackRateButton from './Controls/PlaybackRateButton.vue';
import MediaInformation from './Controls/MediaInformation.vue';
import QueueControl from './Controls/QueueControl.vue';

const {
  currentTime,
  currentTrack,
  duration,
  isPodcast,
  isRadioStation,
  isTrack,
} = useAudioPlayer();
</script>

<template>
  <div :class="$style.playerOptions">
    <p v-if="!isRadioStation" ref="timeProgress" :class="$style.time">
      {{ secondsToHHMMSS(currentTime) }} / {{ secondsToHHMMSS(duration) }}
    </p>

    <VolumeControl />

    <PlaybackRateButton v-if="isPodcast" />

    <MediaInformation v-if="isTrack || isPodcast" />

    <FavouriteButton
      v-if="isTrack"
      :id="currentTrack.id"
      :favourite="currentTrack.favourite"
      :type="currentTrack.type"
    />

    <QueueControl />
  </div>
</template>

<style module>
.playerOptions {
  @mixin align-center;

  gap: var(--media-player-spacing);
  padding-right: var(--media-player-spacing);
}

.time {
  flex-shrink: 0;
  font-size: var(--small-font-size);
}
</style>
