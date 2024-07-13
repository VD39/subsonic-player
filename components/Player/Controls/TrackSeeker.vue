<script setup lang="ts">
import InputRange from '@/components/FormFields/InputRange.vue';

const {
  isRadioStation,
  bufferedDuration,
  currentTime,
  duration,
  setCurrentTime,
} = useAudioPlayer();

const ariaValueText = computed(
  () =>
    `${secondsToHHMMSS(currentTime.value)} of ${secondsToHHMMSS(duration.value)}`,
);
</script>

<template>
  <InputRange
    v-if="!isRadioStation && duration"
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
