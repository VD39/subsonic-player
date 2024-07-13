<script setup lang="ts">
import ButtonLoader from '@/components/Loaders/ButtonLoader.vue';
import IconButton from '@/components/Buttons/IconButton.vue';

const { togglePlay, trackCanPlay, trackIsPlaying } = useAudioPlayer();

const buttonProps = computed<PlayPauseButtonProps>(() => ({
  icon: trackIsPlaying.value ? 'PhPause' : 'PhPlay',
  text: `${trackIsPlaying.value ? 'Pause' : 'Play'} current track.`,
}));
</script>

<template>
  <div :class="$style.playPauseButton">
    <IconButton
      v-if="trackCanPlay"
      :icon="buttonProps.icon"
      :icon-size="30"
      :title="buttonProps.text"
      @click="togglePlay"
    >
      {{ buttonProps.text }}
    </IconButton>

    <ButtonLoader v-else />
  </div>
</template>

<style module>
.playPauseButton {
  @mixin align-center;

  justify-content: center;
  width: 50px;
  height: 50px;
}
</style>
