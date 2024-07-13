<script setup lang="ts">
import PreloadImage from '@/components/Image/PreloadImage.vue';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import PlayingLoader from '@/components/Loaders/PlayingLoader.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import PlayPauseButton from '@/components/Player/Controls/PlayPauseButton.vue';

defineProps<{
  track: QueueTrack;
  isCurrentTrack?: boolean;
  isCurrentTrackPlaying?: boolean;
  inMediaPlayer?: boolean;
  trackCanPlay?: boolean;
}>();

defineEmits(['playCurrentTrack']);

const { getImageUrl } = useAPI();
</script>

<template>
  <div
    :class="[
      $style.trackDetails,
      {
        [$style.mediaPlayer]: inMediaPlayer,
      },
    ]"
  >
    <div :class="$style.imageWrapper">
      <PreloadImage :src="getImageUrl(track.imageId)" />

      <div
        v-if="!inMediaPlayer"
        ref="mediaOptions"
        :class="$style.mediaOptions"
      >
        <div
          v-if="isCurrentTrack"
          ref="currentTrack"
          :class="[
            {
              [$style.trackCanPlay]: trackCanPlay,
              [$style.playing]: isCurrentTrackPlaying,
            },
          ]"
        >
          <PlayingLoader :class="$style.playingLoader">
            Playing current track {{ track.name }}
          </PlayingLoader>

          <PlayPauseButton :class="$style.playPauseButton" />
        </div>

        <IconButton
          v-else
          ref="play"
          icon="PhPlay"
          title="Play Song"
          :class="$style.playButton"
          @click="$emit('playCurrentTrack')"
        >
          Play Song
        </IconButton>
      </div>
    </div>

    <div :class="$style.trackMeta">
      <p v-if="track.album && track.albumId" ref="trackAlbum">
        <NuxtLink :to="`/album/${track.albumId}`">
          {{ track.album }}
        </NuxtLink>
      </p>

      <p class="strong">
        {{ track.title }}
      </p>

      <div :class="$style.secondaryMeta">
        <ArtistsList v-if="track.artists.length" :artists="track.artists" />

        <p :class="$style.duration">
          {{ secondsToHHMMSS(track.duration) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style module>
.trackDetails {
  display: flex;
  gap: var(--media-player-spacing);
  align-items: center;
  padding: var(--space-8) var(--space-12);
  overflow: hidden;
}

.mediaPlayer {
  padding: 0;
}

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

.playButton {
  display: none;
}

.imageWrapper {
  position: relative;
  display: flex;
  width: var(--queue-image-width-height);
  min-width: var(--queue-image-width-height);
  height: var(--queue-image-width-height);
  min-height: var(--queue-image-width-height);

  .mediaPlayer & {
    width: var(--media-player-height);
    min-width: var(--media-player-height);
    height: var(--media-player-height);
    min-height: var(--media-player-height);
  }

  &:hover {
    .playButton,
    .playPauseButton {
      display: flex;
    }

    .playingLoader {
      display: none;
    }
  }
}

.mediaOptions {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
}

.trackMeta {
  font-size: var(--small-font-size);
  line-height: 1;
}

.secondaryMeta {
  @mixin align-center;
}

.duration {
  &::before {
    content: '\00a0\2022\00a0';
  }

  .mediaPlayer & {
    display: none;
  }
}
</style>
