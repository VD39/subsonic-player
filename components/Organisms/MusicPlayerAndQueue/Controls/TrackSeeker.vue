<script setup lang="ts">
import InputRange from '@/components/Atoms/InputRange.vue';

const {
  bufferedDuration,
  currentTime,
  currentTrack,
  fastForwardTrack,
  rewindTrack,
  setCurrentTime,
} = useAudioPlayer();

const ariaValueText = computed(
  () =>
    `${secondsToHHMMSS(currentTime.value)} of ${currentTrack.value.formattedDuration}`,
);

// On webOS TV, make the seeker non-focusable (use skip buttons instead)
const isWebOS =
  typeof window !== 'undefined' && window.location.protocol === 'file:';
const seekerTabindex = isWebOS ? -1 : 0;
</script>

<template>
  <InputRange
    v-slot="{ pendingValue }"
    v-model="currentTime"
    v-bind="$attrs"
    aria-label="Seek"
    :aria-valuetext="ariaValueText"
    :buffer="bufferedDuration"
    delay
    :max="currentTrack.duration"
    :min="0"
    :tabindex="seekerTabindex"
    @change="setCurrentTime"
    @keydown.arrow-left.prevent="rewindTrack"
    @keydown.arrow-right.prevent="fastForwardTrack"
  >
    {{ secondsToHHMMSS(pendingValue) }}
  </InputRange>
</template>
