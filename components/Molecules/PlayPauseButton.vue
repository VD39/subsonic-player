<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const { togglePlay, trackIsBuffering, trackIsPlaying } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => ({
  icon: trackIsPlaying.value ? ICONS.pause : ICONS.play,
  text: `${trackIsPlaying.value ? 'Pause' : 'Play'} current track`,
}));
</script>

<template>
  <ButtonLink
    v-if="trackIsBuffering"
    :icon="buttonProps.icon"
    :title="buttonProps.text"
    @click="togglePlay"
  >
    {{ buttonProps.text }}
  </ButtonLink>

  <SpinningLoader v-else :class="$style.spinningLoader" />
</template>

<style module>
.spinningLoader {
  padding: var(--default-space);
}
</style>
