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

const {
  currentTime,
  currentTrack,
  duration,
  isPodcastEpisode,
  isRadioStation,
  isTrack,
} = useAudioPlayer();
const { toggleQueueList, toggleQueuePlayer } = useQueue();
</script>

<template>
  <div class="queueWrapper column">
    <ButtonLink
      ref="closeQueueMenu"
      class="queueAction"
      full-width
      :icon="ICONS.queueClose"
      icon-weight="bold"
      title="Close queue menu"
      @click="toggleQueuePlayer"
    >
      Close queue menu
    </ButtonLink>

    <div :class="['column', $style.playerWrapper]">
      <div :class="$style.wrapper">
        <div :class="$style.inner">
          <div :class="$style.imageWrapper">
            <div :class="$style.imageInner">
              <div :class="$style.preloadImageWrapper">
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
                    :is-link="!!currentTrack.albumId"
                    :text="currentTrack.album"
                    :to="`/album/${currentTrack.albumId}`"
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
                <LinkOrText
                  v-if="'podcastId' in currentTrack && currentTrack.podcastId"
                  ref="podcastLinkOrText"
                  :is-link="!!currentTrack.podcastId"
                  :text="currentTrack.podcastName"
                  :to="`/podcast/all/${currentTrack.podcastId}`"
                />

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
                v-if="!isRadioStation && duration"
                ref="timeProgress"
                class="smallFont centerItems spaceBetween"
              >
                <time>{{ secondsToHHMMSS(currentTime) }}</time>
                <time>{{ secondsToHHMMSS(duration) }}</time>
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
      full-width
      :icon="ICONS.playlist"
      icon-weight="bold"
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - (var(--space-40) * 2) - (var(--space-16) * 2));
  padding: var(--space-40) var(--space-40) var(--space-16);
}

.inner {
  margin-bottom: var(--space-40);
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

.trackDetailsWrapper {
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
</style>
