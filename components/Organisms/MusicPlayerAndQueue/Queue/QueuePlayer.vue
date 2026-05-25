<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import MainPlayerControls from '@/components/Organisms/MusicPlayerAndQueue/Controls/MainPlayerControls.vue';
import MediaInformation from '@/components/Organisms/MusicPlayerAndQueue/Controls/MediaInformation.vue';
import PlaybackRateButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/PlaybackRateButton.vue';
import RepeatButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/RepeatButton.vue';
import ShuffleButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/ShuffleButton.vue';
import TrackSeeker from '@/components/Organisms/MusicPlayerAndQueue/Controls/TrackSeeker.vue';

const { currentTime, fastForwardTrack, isPlaying, rewindTrack } =
  useAudioPlayer();
const {
  currentTrack,
  isPodcastEpisode,
  isRadioStation,
  isTrack,
  toggleQueueList,
  toggleQueuePlayer,
} = useQueue();
</script>

<template>
  <div class="queueWrapper column">
    <div
      ref="backgroundImage"
      aria-hidden="true"
      :class="[
        $style.backgroundImage,
        {
          [$style.backgroundImageActive]: isPlaying,
        },
      ]"
    >
      <PreloadImage
        :class="$style.backgroundPreloadImage"
        :image="currentTrack.image"
        :lazyLoad="false"
      />
    </div>

    <ButtonLink
      ref="closeQueueMenu"
      class="queueAction"
      fullWidth
      :icon="ICONS.queueClose"
      iconWeight="bold"
      title="Close queue menu"
      @click="toggleQueuePlayer"
    >
      Close queue menu
    </ButtonLink>

    <div :class="['column', $style.playerWrapper]">
      <div :class="$style.wrapper">
        <div :class="['mBXL', $style.inner]">
          <div :class="$style.imageWrapper">
            <div :class="$style.imageInner">
              <div :class="$style.preloadImageWrapper">
                <button
                  ref="rewindButton"
                  :class="[$style.rewindFastForwardButton, $style.rewindButton]"
                  @click="doubleClick(rewindTrack)"
                >
                  <span class="visuallyHidden">
                    {{ REWIND_FAST_FORWARD_TITLES.rewind }}
                  </span>
                </button>
                <button
                  ref="fastForwardButton"
                  :class="[
                    $style.rewindFastForwardButton,
                    $style.fastForwardButton,
                  ]"
                  @click="doubleClick(fastForwardTrack)"
                >
                  <span class="visuallyHidden">
                    {{ REWIND_FAST_FORWARD_TITLES.fastForward }}
                  </span>
                </button>

                <PreloadImage
                  :class="$style.preloadImage"
                  :image="currentTrack.image"
                />
              </div>
            </div>
          </div>
        </div>

        <div :class="$style.trackDetailsWrapper">
          <div :class="['mBAllL', 'column', $style.trackDetails]">
            <div>
              <MarqueeScroll inert>
                <h2 class="strong mBXS">
                  {{ currentTrack.name }}
                </h2>
              </MarqueeScroll>

              <template v-if="isTrack">
                <MarqueeScroll
                  v-if="'album' in currentTrack && currentTrack.album"
                  ref="albumMarqueeScroll"
                >
                  <LinkOrText
                    :isLink="!!currentTrack.albumId"
                    :text="currentTrack.album"
                    :to="{
                      name: ROUTE_NAMES.album,
                      params: {
                        [ROUTE_PARAM_KEYS.album.id]: currentTrack.albumId,
                      },
                    }"
                  />
                </MarqueeScroll>

                <MarqueeScroll
                  v-if="
                    'artists' in currentTrack && currentTrack.artists.length
                  "
                  ref="artistsMarqueeScroll"
                >
                  <ArtistsList :artists="currentTrack.artists" />
                </MarqueeScroll>
              </template>

              <template v-if="isPodcastEpisode">
                <MarqueeScroll
                  v-if="'podcastId' in currentTrack && currentTrack.podcastId"
                  ref="podcastIdMarqueeScroll"
                >
                  <LinkOrText
                    :isLink="!!currentTrack.podcastId"
                    :text="currentTrack.podcastName"
                    :to="{
                      name: ROUTE_NAMES.podcast,
                      params: {
                        [ROUTE_PARAM_KEYS.podcast.sortBy]:
                          ROUTE_PODCAST_FILTER_PARAMS.All,
                        [ROUTE_PARAM_KEYS.podcast.id]: currentTrack.podcastId,
                      },
                    }"
                  />
                </MarqueeScroll>

                <MarqueeScroll
                  v-if="'author' in currentTrack && currentTrack.author"
                  ref="authorMarqueeScroll"
                >
                  <p>{{ currentTrack.author }}</p>
                </MarqueeScroll>
              </template>
            </div>

            <div class="fullWidth">
              <TrackSeeker class="fullWidth" />

              <div
                v-if="!isRadioStation"
                ref="timeProgress"
                class="smallFont centerItems spaceBetween"
              >
                <time>{{ secondsToHHMMSS(currentTime) }}</time>
                <time>{{ currentTrack.formattedDuration }}</time>
              </div>
            </div>

            <MainPlayerControls
              :class="['fullWidth', $style.secondaryOptions]"
            />

            <div
              :class="['centerAll', 'spaceBetween', $style.secondaryOptions]"
            >
              <FavouriteButton
                v-if="'favourite' in currentTrack"
                :id="currentTrack.id"
                :favourite="currentTrack.favourite"
                :type="currentTrack.type"
              />

              <ShuffleButton v-if="!isRadioStation" />

              <RepeatButton v-if="!isRadioStation" />

              <PlaybackRateButton v-if="isPodcastEpisode" />

              <MediaInformation v-if="!isRadioStation" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ButtonLink
      ref="openQueueList"
      class="queueAction"
      fullWidth
      :icon="ICONS.playlist"
      iconWeight="bold"
      title="Open queue list"
      @click="toggleQueueList"
    >
      Open queue list
    </ButtonLink>
  </div>
</template>

<style module>
.playerWrapper {
  flex: 1;
  width: var(--width-height-100);
  max-width: 700px;
  margin: auto;
}

.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - (var(--space-40) * 2) - (var(--space-16) * 2));
  padding: var(--space-40) var(--space-40) var(--space-16);
}

.inner {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.imageWrapper {
  display: flex;
  max-width: 500px;
  aspect-ratio: 1;
  margin: auto;
}

.imageInner {
  position: relative;
  aspect-ratio: 1;
}

.preloadImageWrapper {
  position: absolute;
  top: 0;
  width: var(--width-height-100);
}

.imageWrapper,
.imageInner,
.preloadImageWrapper,
.preloadImage {
  height: var(--width-height-100);
}

.rewindFastForwardButton {
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgb(0 0 0 / 0%);
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  width: 50%;
}

.rewindButton {
  left: 0;
}

.fastForwardButton {
  right: 0;
}

.trackDetailsWrapper {
  position: relative;
  z-index: 1;
  display: contents;
}

.trackDetails {
  flex: 1;
  justify-content: end;
  margin-top: auto;
}

.secondaryOptions {
  max-width: 400px;
  margin: 0 auto;
}

.backgroundImage {
  --queue-player-animation-play-state: paused;

  position: fixed;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: 0.5;
}

.backgroundImageActive {
  --queue-player-animation-play-state: running;
}

.backgroundPreloadImage {
  width: var(--width-height-100);
  height: var(--width-height-100);
  aspect-ratio: unset;
  filter: blur(16px);
  transform-origin: center;
  animation: background-drift 12s ease-in-out infinite;
  animation-play-state: var(--queue-player-animation-play-state);

  @media (--tablet-up) {
    filter: blur(60px);
  }
}

@keyframes background-drift {
  0%,
  100% {
    transform: scale(1.3) translate(-8%, 0);
  }

  50% {
    transform: scale(1.3) translate(8%, 0);
  }
}
</style>
