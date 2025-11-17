<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const { isBuffering, isPlaying, togglePlay } = useAudioPlayer();

const buttonProps = computed(() => ({
  icon: isPlaying.value ? ICONS.pause : ICONS.play,
  text: `${isPlaying.value ? 'Pause' : 'Play'} current track`,
}));
</script>

<template>
  <ButtonLink
    v-if="!isBuffering"
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
