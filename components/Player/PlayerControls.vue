<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import PlayPauseButton from './Controls/PlayPauseButton.vue';
import RepeatButton from './Controls/RepeatButton.vue';
import ShuffleButton from './Controls/ShuffleButton.vue';

const {
  fastForwardTrack,
  hasNextTrack,
  hasPreviousTrack,
  isPodcast,
  isRadioStation,
  playNextTrack,
  playPreviousTrack,
  rewindTrack,
} = useAudioPlayer();

const rewindFastForwardTitle = {
  rewind: `Rewind back ${REWIND_TRACK_TIME} seconds`,
  fastForward: `Fast forward back ${FAST_FORWARD_TRACK_TIME} seconds`,
};
</script>

<template>
  <div :class="$style.playerControls">
    <ShuffleButton v-if="!isRadioStation" />

    <IconButton
      ref="previousTrack"
      icon="PhSkipBack"
      title="Previous track"
      :disabled="!hasPreviousTrack"
      @click="playPreviousTrack"
    >
      Previous track
    </IconButton>

    <IconButton
      v-if="isPodcast"
      ref="rewind"
      icon="PhRewind"
      :title="rewindFastForwardTitle.rewind"
      @click="rewindTrack"
    >
      {{ rewindFastForwardTitle.rewind }}
    </IconButton>

    <PlayPauseButton />

    <IconButton
      v-if="isPodcast"
      ref="fastForward"
      icon="PhFastForward"
      :title="rewindFastForwardTitle.fastForward"
      @click="fastForwardTrack"
    >
      {{ rewindFastForwardTitle.fastForward }}
    </IconButton>

    <IconButton
      ref="nextTrack"
      icon="PhSkipForward"
      title="Next track"
      :disabled="!hasNextTrack"
      @click="playNextTrack"
    >
      Next track
    </IconButton>

    <RepeatButton v-if="!isRadioStation" />
  </div>
</template>

<style module>
.playerControls {
  @mixin align-center;

  gap: var(--media-player-spacing);
}
</style>
