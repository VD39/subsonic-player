<script setup lang="ts">
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import MediaInformation from '@/components/Organisms/MusicPlayerAndQueue/Controls/MediaInformation.vue';
import PlaybackRateButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/PlaybackRateButton.vue';
import QueueButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/QueueButton.vue';
import VolumeControl from '@/components/Organisms/MusicPlayerAndQueue/Controls/VolumeControl.vue';

const {
  currentTime,
  currentTrack,
  duration,
  isPodcastEpisode,
  isRadioStation,
} = useAudioPlayer();
</script>

<template>
  <div :class="['centerAll', $style.playerOptions]">
    <p
      v-if="!isRadioStation && duration"
      ref="timeProgress"
      :class="['smallFont', $style.time]"
    >
      {{ secondsToHHMMSS(currentTime) }} / {{ secondsToHHMMSS(duration) }}
    </p>

    <VolumeControl />

    <PlaybackRateButton v-if="isPodcastEpisode" />

    <MediaInformation v-if="!isRadioStation" />

    <FavouriteButton
      v-if="'favourite' in currentTrack"
      :id="currentTrack.id"
      :favourite="currentTrack.favourite"
      :type="currentTrack.type"
    />

    <QueueButton />
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
