<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import InputRange from '@/components/FormFields/InputRange.vue';

const { setVolume, isMuted, toggleVolume, volume } = useAudioPlayer();

const previousVolume = ref(volume.value);

const ariaValueText = computed(() => `${volume.value} of 1`);
const volumeTitle = computed(() => (isMuted.value ? 'Unmute' : 'Mute'));
const volumeIcon = computed(() => {
  if (volume.value > 0.5) {
    return 'PhSpeakerHigh';
  }

  if (volume.value > 0.2) {
    return 'PhSpeakerLow';
  }

  if (volume.value > 0) {
    return 'PhSpeakerNone';
  }

  return 'PhSpeakerX';
});

function changeAudioVolume() {
  previousVolume.value = volume.value;
  setVolume(volume.value);
}

function toggleAudioVolume() {
  toggleVolume(previousVolume.value);
}
</script>

<template>
  <div :class="$style.volumeControl">
    <IconButton
      :icon="volumeIcon"
      :title="volumeTitle"
      @click="toggleAudioVolume"
    >
      {{ volumeTitle }}
    </IconButton>

    <div>
      <InputRange
        v-model="volume"
        :min="0"
        :max="1"
        aria-label="Volume"
        :class="$style.volumeInput"
        :aria-valuetext="ariaValueText"
        hide-thumb
        @change="changeAudioVolume"
      />

      <p ref="currentVolume" class="visually-hidden">
        Volume at {{ volume * 100 }}%
      </p>
    </div>
  </div>
</template>

<style module>
.volumeControl {
  @mixin align-center;

  padding-right: var(--media-player-spacing);
}

.volumeInput {
  width: 50px;
}
</style>
