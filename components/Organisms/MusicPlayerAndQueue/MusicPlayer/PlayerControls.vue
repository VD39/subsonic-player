<script setup lang="ts">
import MainPlayerControls from '@/components/Organisms/MusicPlayerAndQueue/Controls/MainPlayerControls.vue';
import RepeatButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/RepeatButton.vue';
import ShuffleButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/ShuffleButton.vue';

const { isRadioStation } = useAudioPlayer();
</script>

<template>
  <div :class="['centerItems', $style.playerControls]">
    <ShuffleButton v-if="!isRadioStation" />

    <MainPlayerControls />

    <RepeatButton v-if="!isRadioStation" />
  </div>
</template>

<style module>
.playerControls {
  gap: var(--default-space);
}
</style>
