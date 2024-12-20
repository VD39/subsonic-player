<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputRange from '@/components/Atoms/InputRange.vue';

const { isMuted, setVolume, toggleVolume, volume } = useAudioPlayer();

const previousVolume = ref(volume.value);

const ariaValueText = computed(() => `${volume.value} of 1`);
const volumePercentage = computed(() => Math.floor(volume.value * 100));
const volumeTitle = computed(() => (isMuted.value ? 'Unmute' : 'Mute'));
const volumeIcon = computed(() => {
  switch (true) {
    case volume.value > 0.5:
      return ICONS.volume05;
    case volume.value > 0.2:
      return ICONS.volume02;
    case volume.value > 0:
      return ICONS.volume0;
    default:
      return ICONS.volumeDefault;
  }
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
  <div :class="['centerItems', $style.volumeControl]">
    <ButtonLink
      :icon="volumeIcon"
      :title="volumeTitle"
      @click="toggleAudioVolume"
    >
      {{ volumeTitle }}
    </ButtonLink>

    <div :class="['centerItems', 'smallFont', $style.volumeInputWrapper]">
      <InputRange
        v-model="volume"
        :min="0"
        :max="1"
        aria-label="Volume"
        :aria-valuetext="ariaValueText"
        hide-thumb
        @change="changeAudioVolume"
      />

      <p aria-hidden :class="$style.currentVolume">{{ volumePercentage }}</p>

      <p ref="currentVolume" class="visuallyHidden">
        Volume at {{ volumePercentage }}%
      </p>
    </div>
  </div>
</template>

<style module>
.volumeControl {
  position: relative;

  @media (hover: hover) {
    &:hover {
      .volumeInputWrapper {
        --volume-input-visibility: visible;
      }
    }
  }
}

.volumeInputWrapper {
  --volume-input-visibility: hidden;

  position: absolute;
  top: calc(var(--default-space) * -4);
  left: 50%;
  z-index: 10;
  gap: var(--default-space);
  width: 200px;
  padding: var(--default-space);
  visibility: var(--volume-input-visibility);
  background: var(--secondary-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-large);
  transition: visibility var(--transition);
  transform: translateX(-50%);
}

.currentVolume {
  width: 25px;
  text-align: right;
}
</style>
