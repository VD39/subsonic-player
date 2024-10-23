<script setup lang="ts">
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';

import MediaInformation from './Controls/MediaInformation.vue';
import PlaybackRateButton from './Controls/PlaybackRateButton.vue';
import VolumeControl from './Controls/VolumeControl.vue';

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
  <div :class="['centerItems', $style.playerOptions]">
    <p
      v-if="!isRadioStation && duration"
      ref="timeProgress"
      :class="['smallFont', $style.time]"
    >
      {{ secondsToHHMMSS(currentTime) }} / {{ secondsToHHMMSS(duration) }}
    </p>

    <VolumeControl />

    <PlaybackRateButton v-if="isPodcast" />

    <MediaInformation v-if="isTrack || isPodcast" />

    <FavouriteButton
      v-if="'favourite' in currentTrack"
      :id="currentTrack.id"
      :favourite="currentTrack.favourite"
      :type="currentTrack.type"
    />
  </div>
</template>

<style module>
.playerOptions {
  gap: var(--default-space);
  padding-right: var(--default-space);
}

.time {
  flex-shrink: 0;
  margin-right: var(--default-space);
}
</style>
