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

const { currentTime, currentTrack, isPodcastEpisode, isRadioStation, isTrack } =
  useAudioPlayer();
const { toggleQueueList, toggleQueuePlayer } = useQueue();
</script>

<template>
  <div class="queueWrapper column">
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
                          ROUTE_PODCAST_SORT_BY_PARAMS.All,
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - (var(--space-40) * 2) - (var(--space-16) * 2));
  padding: var(--space-40) var(--space-40) var(--space-16);
}

.inner {
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
