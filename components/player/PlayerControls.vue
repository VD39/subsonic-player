<script setup lang="ts">
import MainPlayerControls from '@/components/player/controls/MainPlayerControls.vue';
import RepeatButton from '@/components/player/controls/RepeatButton.vue';
import ShuffleButton from '@/components/player/controls/ShuffleButton.vue';

const { isRadioStation } = useQueue();
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
