<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import PlayPauseButton from '@/components/Molecules/PlayPauseButton.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';
import QueueButton from '@/components/Organisms/MusicPlayerAndQueue/Controls/QueueButton.vue';
import TrackSeeker from '@/components/Organisms/MusicPlayerAndQueue/Controls/TrackSeeker.vue';

import PlayerControls from './PlayerControls.vue';
import PlayerOptions from './PlayerOptions.vue';

const { currentTrack } = useAudioPlayer();
</script>

<template>
  <div :class="$style.musicPlayer">
    <TrackSeeker :class="['desktopOnly', $style.trackSeeker]" />

    <div :class="['spaceBetween', 'centerItems', $style.inner]">
      <div :class="['centerItems', $style.trackDetailsWrapper]">
        <QueueButton :class="['mobileOnly', $style.queueControl]" />

        <ImageLink
          v-if="'albumId' in currentTrack && currentTrack.albumId"
          ref="albumImageLink"
          :to="`/album/${currentTrack.albumId}`"
          :title="`Go to album ${currentTrack.name}`"
          :image="currentTrack.image"
          :class="$style.image"
        />

        <ImageLink
          v-else-if="'podcastId' in currentTrack && currentTrack.podcastId"
          ref="podcastImageLink"
          :to="`/podcast/all/${currentTrack.podcastId}`"
          :title="`Go to podcast ${currentTrack.podcastName}`"
          :image="currentTrack.image"
          :class="$style.image"
        />

        <PreloadImage
          v-else
          :image="currentTrack.image"
          :class="$style.image"
        />

        <div :class="$style.trackDetails">
          <MarqueeScroll>
            <p class="strong mBXS">
              {{ currentTrack.name }}
            </p>
          </MarqueeScroll>

          <MarqueeScroll
            v-if="'artists' in currentTrack && currentTrack.artists.length"
            ref="artistsMarqueeScroll"
          >
            <ArtistsList :artists="currentTrack.artists" class="smallFont" />
          </MarqueeScroll>

          <MarqueeScroll
            v-if="'author' in currentTrack && currentTrack.author"
            ref="authorMarqueeScroll"
          >
            <p>{{ currentTrack.author }}</p>
          </MarqueeScroll>
        </div>
      </div>

      <PlayPauseButton :class="['mobileOnly', $style.playPauseButton]" />

      <PlayerControls class="centerAll desktopOnly" />

      <PlayerOptions :class="['desktopOnly', $style.playerOptions]" />
    </div>
  </div>
</template>

<style module>
.musicPlayer {
  --music-player-bottom: var(--header-height);

  position: fixed;
  inset: auto 0 var(--music-player-bottom);
  z-index: 9;
  height: var(--media-player-height);
  max-height: var(--media-player-height);
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  box-shadow: var(--dark-box-shadow-medium);

  @media (--tablet-up) {
    --music-player-bottom: 0;
  }
}

.trackSeeker {
  position: absolute;
  z-index: 9;
  display: block;
  transform: translateY(-50%);
}

.inner {
  position: relative;

  @media (--tablet-up) {
    display: grid;
    grid-template-columns: 25% auto 25%;
  }
}

.trackDetailsWrapper {
  position: relative;
  gap: var(--default-space);
}

.trackDetails,
.trackDetailsWrapper {
  flex: 1;
  overflow: hidden;
}

.queueControl {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
}

.image,
.playPauseButton {
  flex-shrink: 0;
  width: var(--media-player-height);
  height: var(--media-player-height);
}

.playPauseButton {
  justify-content: center;
}

.playerOptions {
  justify-content: end;
}
</style>
