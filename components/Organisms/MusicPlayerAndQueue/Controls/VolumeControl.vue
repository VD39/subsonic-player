<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputRange from '@/components/Atoms/InputRange.vue';

const { isMuted, setVolume, toggleMute, volume } = useAudioPlayer();

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
  setVolume(volume.value);
}
</script>

<template>
  <div :class="['centerItems', $style.volumeControl]">
    <ButtonLink :icon="volumeIcon" :title="volumeTitle" @click="toggleMute">
      {{ volumeTitle }}
    </ButtonLink>

    <div :class="['centerItems', 'smallFont', $style.volumeInputWrapper]">
      <InputRange
        v-model="volume"
        aria-label="Volume"
        :aria-valuetext="ariaValueText"
        :max="1"
        :min="0"
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
  visibility: var(--volume-input-visibility);
  gap: var(--default-space);
  width: 200px;
  padding: var(--default-space);
  background: var(--secondary-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-large);
  transform: translateX(-50%);
  transition: visibility var(--transition);
}

.currentVolume {
  width: 25px;
  text-align: right;
}
</style>
