<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import PlayPauseButton from '@/components/Molecules/PlayPauseButton.vue';

const {
  fastForwardTrack,
  hasNextTrack,
  hasPreviousTrack,
  isPodcastEpisode,
  playNextTrack,
  playPreviousTrack,
  rewindTrack,
} = useAudioPlayer();

// Detect if running on webOS TV
const isWebOS =
  typeof window !== 'undefined' && window.location.protocol === 'file:';
</script>

<template>
  <div class="centerItems spaceBetween">
    <ButtonLink
      ref="previousTrack"
      :disabled="!hasPreviousTrack"
      :icon="ICONS.skipBack"
      iconWeight="fill"
      title="Previous track"
      @click="playPreviousTrack"
    >
      Previous track
    </ButtonLink>

    <ButtonLink
      v-if="isPodcastEpisode || isWebOS"
      ref="rewind"
      :icon="ICONS.rewind"
      :title="REWIND_FAST_FORWARD_TITLES.rewind"
      @click="rewindTrack"
    >
      {{ REWIND_FAST_FORWARD_TITLES.rewind }}
    </ButtonLink>

    <PlayPauseButton :class="$style.playPauseButton" />

    <ButtonLink
      v-if="isPodcastEpisode || isWebOS"
      ref="fastForward"
      :icon="ICONS.fastForward"
      :title="REWIND_FAST_FORWARD_TITLES.fastForward"
      @click="fastForwardTrack"
    >
      {{ REWIND_FAST_FORWARD_TITLES.fastForward }}
    </ButtonLink>

    <ButtonLink
      ref="nextTrack"
      :disabled="!hasNextTrack"
      :icon="ICONS.skipForward"
      iconWeight="fill"
      title="Next track"
      @click="playNextTrack"
    >
      Next track
    </ButtonLink>
  </div>
</template>

<style module>
.playPauseButton {
  margin: 0 var(--space-4);
  transform: scale(1.5);
}
</style>
