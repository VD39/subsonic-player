<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import PlayingLoader from '@/components/Atoms/PlayingLoader.vue';
import PlayPauseButton from '@/components/Molecules/PlayPauseButton.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  hideImage?: boolean;
  image: string;
  large?: boolean;
  trackId: string;
  trackNumber: number | string;
}>();

defineEmits<{
  playTrack: [];
}>();

const { currentTrack, isBuffering, isCurrentTrack, isPlaying } =
  useAudioPlayer();
</script>

<template>
  <div
    :class="[
      'overlapWrapper',
      $style.trackPlayPause,
      {
        [$style.large]: large,
        [$style.withImage]: image && !hideImage,
        [$style.currentTrack]: isCurrentTrack(trackId),
      },
    ]"
  >
    <PreloadImage
      :class="[
        'overlap',
        $style.preloadImage,
        {
          [$style.hideImage]: hideImage,
        },
      ]"
      :image
      :lazyLoad="!hideImage"
    />

    <p
      ref="trackNumber"
      :class="[
        'overlap',
        $style.trackNumber,
        {
          visuallyHidden: !hideImage,
        },
      ]"
    >
      {{ trackNumber }}
    </p>

    <div :class="['overlap', $style.playPauseWrapper]">
      <div
        v-if="isCurrentTrack(trackId)"
        ref="playPauseWrapper"
        :class="[
          'centerAll',
          $style.playPauseInner,
          {
            [$style.buffering]: isBuffering,
            [$style.paused]: !isPlaying,
            [$style.playing]: isPlaying,
          },
        ]"
      >
        <PlayingLoader :class="$style.playingLoader" :playing="isPlaying">
          Playing current track {{ currentTrack.name }}
        </PlayingLoader>

        <PlayPauseButton
          :class="['centerAll', 'themeHoverButton', $style.playPauseButton]"
        />
      </div>

      <ButtonLink
        v-else
        ref="play"
        :class="['centerAll', 'themeHoverButton', $style.buttonLink]"
        :icon="ICONS.play"
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

.hideImage {
  opacity: 0;
}

.trackNumber,
.playPauseWrapper {
  transition: all var(--transition);
}

.preloadImage {
  background-color: var(--white-color);
}

.trackNumber {
  --track-number-visibility: visible;
  --track-number-opacity: 1;
  --track-number-transform: unset;
  --track-number-display: flex;

  display: var(--track-number-display);
  visibility: var(--track-number-visibility);
  opacity: var(--track-number-opacity);
  transform: var(--track-number-transform);
}

.playPauseWrapper {
  --play-pause-visibility: hidden;
  --play-pause-opacity: 0;
  --play-pause-transform: scale(0);

  visibility: var(--play-pause-visibility);
  opacity: var(--play-pause-opacity);
  transform: var(--play-pause-transform);
}

.playPauseInner {
  width: var(--track-width-height);
  height: var(--track-width-height);
}

.buttonLink,
.playPauseButton {
  --play-pause-width-height: calc(var(--track-width-height-default) - 15%);

  width: var(--play-pause-width-height);
  height: var(--play-pause-width-height);
  aspect-ratio: 1;
  margin: auto;
  transform: unset;

  .large & {
    --play-pause-width-height: calc(var(--track-width-height-default) * 1.25);
  }
}

.playingLoader {
  --playing-loader-display: flex;

  display: var(--playing-loader-display);
}

.playPauseButton {
  --play-pause-button-display: flex;

  display: var(--play-pause-button-display);
}

.currentTrack {
  .trackNumber {
    --track-number-display: none;
  }

  &.withImage {
    .playPauseInner {
      background-color: color-mix(
        in oklab,
        var(--black-color) 65%,
        transparent
      );
    }
  }
}

@media (hover: hover) {
  :global(body:not(.disableAllPointerEvents)) :global(.trackRow) {
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
    .playPauseWrapper {
      --play-pause-visibility: visible;
      --play-pause-opacity: 1;
      --play-pause-transform: unset;
    }

    .playing {
      .playingLoader {
        --playing-loader-display: flex;
      }

      .playPauseButton {
        --play-pause-button-display: none;
      }
    }

    .buffering,
    .paused {
      .playingLoader {
        --playing-loader-display: none;
      }

      .playPauseButton {
        --play-pause-button-display: flex;
      }
    }

    &:hover {
      .playing {
        .playingLoader {
          --playing-loader-display: none;
        }

        .playPauseButton {
          --play-pause-button-display: flex;
        }
      }
    }
  }
}

@media (hover: none) {
  .playPauseWrapper {
    --play-pause-visibility: visible;
    --play-pause-opacity: 0;
    --play-pause-transform: unset;
  }

  .currentTrack {
    .playPauseWrapper {
      --play-pause-opacity: 1;
    }

    .playing,
    .paused {
      .playingLoader {
        --playing-loader-display: flex;
      }

      .playPauseButton {
        --play-pause-button-display: none;
      }
    }

    .buffering {
      .playingLoader {
        --playing-loader-display: none;
      }

      .playPauseButton {
        --play-pause-button-display: flex;
      }
    }
  }
}
</style>
