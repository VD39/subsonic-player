<script setup lang="ts">
import InputRange from '@/components/Atoms/InputRange.vue';

const { bufferedDuration, currentTime, currentTrack, setCurrentTime } =
  useAudioPlayer();

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
    @change="setCurrentTime"
  >
    {{ secondsToHHMMSS(pendingValue) }}
  </InputRange>
</template>
