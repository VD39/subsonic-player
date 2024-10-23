<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import PlayingLoader from '@/components/Atoms/PlayingLoader.vue';
import PlayPauseButton from '@/components/Molecules/PlayPauseButton.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  image?: string;
  large?: boolean;
  trackId: string;
  trackNumber: number | string;
}>();

defineEmits(['playTrack']);

const { currentTrack, isCurrentTrack, trackIsBuffering, trackIsPlaying } =
  useAudioPlayer();
</script>

<template>
  <div
    :class="[
      'overlapWrapper',
      $style.trackPlayPause,
      {
        [$style.large]: large,
        [$style.withImage]: image,
        [$style.currentTrack]: isCurrentTrack(trackId),
      },
    ]"
  >
    <PreloadImage v-if="image" :image="image" class="overlap" />

    <p v-else ref="trackNumber" :class="['overlap', $style.trackNumber]">
      {{ trackNumber }}
    </p>

    <div
      ref="playPauseWrapper"
      :class="[
        'overlap',
        $style.playPauseWrapper,
        {
          [$style.buffering]: trackIsBuffering,
          [$style.playing]: trackIsPlaying,
        },
      ]"
    >
      <template v-if="isCurrentTrack(trackId)">
        <PlayingLoader :class="$style.playingLoader">
          Playing current track {{ currentTrack.name }}
        </PlayingLoader>

        <PlayPauseButton
          :class="['centerAll', 'themeHoverButton', $style.playPauseButton]"
        />
      </template>

      <ButtonLink
        v-else
        ref="play"
        :icon="ICONS.play"
        :class="[
          'itemLink',
          'centerAll',
          'themeHoverButton',
          $style.buttonLink,
        ]"
        @click="$emit('playTrack')"
      >
        Play track
      </ButtonLink>
    </div>
  </div>
</template>

<style module>
.trackPlayPause {
  --track-width-height: var(--track-width-height-default);

  width: var(--track-width-height);
  height: var(--track-width-height);
  overflow: hidden;
  border-radius: var(--border-radius-medium);
}

.large {
  --track-width-height: var(--track-width-height-large);
}

.trackNumber,
.playPauseWrapper {
  transition: all var(--transition);
}

.trackNumber {
  --track-number-visibility: visible;
  --track-number-opacity: 1;
  --track-number-transform: unset;

  visibility: var(--track-number-visibility);
  opacity: var(--track-number-opacity);
  transform: var(--track-number-transform);
}

.playPauseWrapper {
  --play-pause-visibility: hidden;
  --play-pause-opacity: 0;
  --play-pause-transform: scale(0.4);

  visibility: var(--play-pause-visibility);
  opacity: var(--play-pause-opacity);
  transform: var(--play-pause-transform);
}

.buttonLink,
.playPauseButton {
  --play-pause-width-height: calc(var(--track-width-height-default) - 15%);

  width: var(--play-pause-width-height);
  height: var(--play-pause-width-height);
  margin: auto;
  transform: unset;

  .large & {
    --play-pause-width-height: calc(var(--track-width-height-default) * 1.25);
  }
}

:global(.trackRow) {
  &:hover {
    .playPauseWrapper {
      --play-pause-visibility: visible;
      --play-pause-opacity: 1;
      --play-pause-transform: unset;
    }

    .trackNumber {
      --track-number-visibility: hidden;
      --track-number-opacity: 0;
      --track-number-transform: scale(2);
    }
  }
}

.currentTrack {
  .trackNumber {
    display: none;
  }

  .playPauseWrapper {
    --play-pause-visibility: visible;
    --play-pause-opacity: 1;
    --play-pause-transform: unset;
  }

  .playingLoader {
    display: none;
  }

  &.withImage {
    .playing {
      height: var(--width-height-100);
      background-color: color-mix(
        in oklab,
        var(--black-color) 75%,
        transparent
      );
    }

    &:hover {
      .playing {
        background-color: transparent;
      }
    }
  }

  .playing {
    &.buffering {
      .playingLoader {
        display: flex;
      }

      .playPauseButton {
        display: none;
      }
    }
  }

  &:hover {
    .playing {
      &.buffering {
        .playingLoader {
          display: none;
        }

        .playPauseButton {
          display: flex;
        }
      }
    }
  }
}
</style>
