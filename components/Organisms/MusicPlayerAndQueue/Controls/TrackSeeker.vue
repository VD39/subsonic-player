<script setup lang="ts">
import InputRange from '@/components/Atoms/InputRange.vue';

const { bufferedDuration, currentTime, duration, setCurrentTime } =
  useAudioPlayer();

const ariaValueText = computed(
  () =>
    `${secondsToHHMMSS(currentTime.value)} of ${secondsToHHMMSS(duration.value)}`,
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
    :max="duration"
    :min="0"
    @change="setCurrentTime"
  >
    {{ secondsToHHMMSS(pendingValue) }}
  </InputRange>
</template>
