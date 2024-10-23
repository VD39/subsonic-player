<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import PlayPauseButton from '@/components/Molecules/PlayPauseButton.vue';

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
  fastForward: `Fast forward back ${FAST_FORWARD_TRACK_TIME} seconds`,
  rewind: `Rewind back ${REWIND_TRACK_TIME} seconds`,
};
</script>

<template>
  <div :class="['centerItems', $style.playerControls]">
    <ShuffleButton v-if="!isRadioStation" />

    <ButtonLink
      ref="previousTrack"
      :icon="ICONS.skipBack"
      title="Previous track"
      :disabled="!hasPreviousTrack"
      @click="playPreviousTrack"
    >
      Previous track
    </ButtonLink>

    <ButtonLink
      v-if="isPodcast"
      ref="rewind"
      :icon="ICONS.rewind"
      :title="rewindFastForwardTitle.rewind"
      @click="rewindTrack"
    >
      {{ rewindFastForwardTitle.rewind }}
    </ButtonLink>

    <PlayPauseButton :class="$style.playPauseButton" />

    <ButtonLink
      v-if="isPodcast"
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
      title="Next track"
      :disabled="!hasNextTrack"
      @click="playNextTrack"
    >
      Next track
    </ButtonLink>

    <RepeatButton v-if="!isRadioStation" />
  </div>
</template>

<style module>
.playerControls {
  gap: var(--default-space);
}

.playPauseButton {
  margin: 0 var(--space-4);
  transform: scale(1.5);
}
</style>
