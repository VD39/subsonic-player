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

    <div :class="$style.volumeInputWrapper">
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

      <p ref="currentVolume" :class="$style.currentVolume">
        <span class="visually-hidden">Volume at </span>
        {{ Math.floor(volume * 100) }}
        <span class="visually-hidden">%</span>
      </p>
    </div>
  </div>
</template>

<style module>
.volumeControl {
  @mixin align-center;

  position: relative;

  &:hover {
    .volumeInputWrapper {
      visibility: visible;
    }
  }
}

/* stylelint-disable-next-line no-descending-specificity */
.volumeInputWrapper {
  @mixin align-center;

  position: absolute;
  top: calc(var(--space-12) * -3);
  left: 50%;
  z-index: 5;
  gap: var(--space-8);
  width: 200px;
  padding: var(--space-8) var(--space-12);
  font-size: var(--small-font-size);
  visibility: hidden;
  background: var(--secondary-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-large);
  transition: visibility 0.5s ease-in-out;
  transform: translateX(-50%);
}

.volumeInput {
  width: 100%;
}

.currentVolume {
  width: 20px;
  text-align: center;
}
</style>
