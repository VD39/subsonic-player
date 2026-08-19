<script setup lang="ts">
import FavouriteButton from '@/components/favourite/FavouriteButton.vue';
import MediaInformation from '@/components/player/controls/MediaInformation.vue';
import PlaybackRateButton from '@/components/player/controls/PlaybackRateButton.vue';
import QueueButton from '@/components/player/controls/QueueButton.vue';
import VolumeControl from '@/components/player/controls/VolumeControl.vue';

const { currentTime } = useAudioPlayer();
const { currentTrack, isPodcastEpisode, isRadioStation } = useQueue();
</script>

<template>
  <div :class="['centerAll', $style.playerOptions]">
    <p
      v-if="!isRadioStation"
      ref="timeProgress"
      :class="['smallFont', $style.time]"
    >
      {{ secondsToHHMMSS(currentTime) }} /
      {{ currentTrack.formattedDuration }}
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
