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

const rewindFastForwardTitle = {
  fastForward: `Fast forward back ${FAST_FORWARD_TRACK_TIME} seconds`,
  rewind: `Rewind back ${REWIND_TRACK_TIME} seconds`,
};
</script>

<template>
  <div class="centerItems spaceBetween">
    <ButtonLink
      ref="previousTrack"
      :icon="ICONS.skipBack"
      icon-weight="fill"
      title="Previous track"
      :disabled="!hasPreviousTrack"
      @click="playPreviousTrack"
    >
      Previous track
    </ButtonLink>

    <ButtonLink
      v-if="isPodcastEpisode"
      ref="rewind"
      :icon="ICONS.rewind"
      :title="rewindFastForwardTitle.rewind"
      @click="rewindTrack"
    >
      {{ rewindFastForwardTitle.rewind }}
    </ButtonLink>

    <PlayPauseButton :class="$style.playPauseButton" />

    <ButtonLink
      v-if="isPodcastEpisode"
      ref="fastForward"
      :icon="ICONS.fastForward"
      :title="rewindFastForwardTitle.fastForward"
      @click="fastForwardTrack"
    >
      {{ rewindFastForwardTitle.fastForward }}
    </ButtonLink>

    <ButtonLink
      ref="nextTrack"
      :icon="ICONS.skipForward"
      icon-weight="fill"
      title="Next track"
      :disabled="!hasNextTrack"
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
