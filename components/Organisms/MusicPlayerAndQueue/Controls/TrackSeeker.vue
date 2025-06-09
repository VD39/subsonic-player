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
</script>

<template>
  <InputRange
    v-slot="{ pendingValue }"
    v-model="currentTime"
    aria-label="Seek"
    :aria-valuetext="ariaValueText"
    :buffer="bufferedDuration"
    delay
    :max="currentTrack.duration"
    :min="0"
    tabindex="0"
    @change="setCurrentTime"
    @keydown.arrow-left.prevent="rewindTrack"
    @keydown.arrow-right.prevent="fastForwardTrack"
  >
    {{ secondsToHHMMSS(pendingValue) }}
  </InputRange>
</template>
