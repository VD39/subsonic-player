<script setup lang="ts">
import InputRange from '@/components/Atoms/InputRange.vue';

const { bufferedDuration, currentTime, fastForwardTrack, rewindTrack, seekTo } =
  useAudioPlayer();
const { currentTrack } = useQueue();

const ariaValueText = computed(
  () =>
    `${secondsToHHMMSS(currentTime.value)} of ${currentTrack.value.formattedDuration}`,
);
</script>

<template>
  <InputRange
    v-slot="{ pendingValue }"
    v-model="currentTime"
    v-bind="$attrs"
    aria-label="Seek"
    :aria-valuetext="ariaValueText"
    :buffer="bufferedDuration"
    commitOnRelease
    :max="currentTrack.duration"
    :min="0"
    tabindex="0"
    @change="seekTo"
    @keydown.arrow-left.prevent="rewindTrack"
    @keydown.arrow-right.prevent="fastForwardTrack"
  >
    {{ secondsToHHMMSS(pendingValue) }}
  </InputRange>
</template>
