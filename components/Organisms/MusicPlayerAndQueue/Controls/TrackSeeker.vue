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
    :buffer="bufferedDuration"
    :min="0"
    :max="duration"
    delay
    aria-label="Seek"
    :aria-valuetext="ariaValueText"
    @change="setCurrentTime"
  >
    {{ secondsToHHMMSS(pendingValue) }}
  </InputRange>
</template>
