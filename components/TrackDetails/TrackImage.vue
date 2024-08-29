<script setup lang="ts">
import PlayingLoader from '@/components/Loaders/PlayingLoader.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import PlayPauseButton from '@/components/Player/Controls/PlayPauseButton.vue';

defineProps<{
  trackId: string;
}>();

defineEmits(['playCurrentTrack']);

const { currentTrack, isCurrentTrack, trackCanPlay, trackIsPlaying } =
  useAudioPlayer();
</script>

<template>
  <div :class="$style.trackImage">
    <div
      v-if="isCurrentTrack(trackId)"
      ref="currentTrack"
      :class="[
        {
          [$style.trackCanPlay]: trackCanPlay,
          [$style.playing]: trackIsPlaying,
        },
      ]"
    >
      <PlayingLoader :class="$style.playingLoader">
        Playing current track {{ currentTrack.name }}
      </PlayingLoader>

      <PlayPauseButton :class="[$style.playPauseButton]" />
    </div>

    <IconButton
      v-else
      ref="play"
      icon="PhPlay"
      title="Play track"
      :class="['itemLink', $style.playButton]"
      @click="$emit('playCurrentTrack')"
    >
      Play track
    </IconButton>
  </div>
</template>

<style module>
.playingLoader {
  display: none;

  .playing.trackCanPlay & {
    display: flex;
  }
}

.playPauseButton {
  .playing.trackCanPlay & {
    display: none;
  }
}

.trackImage {
  &:hover {
    .playPauseButton {
      display: flex;
    }

    .playingLoader {
      display: none;
    }
  }
}
</style>
