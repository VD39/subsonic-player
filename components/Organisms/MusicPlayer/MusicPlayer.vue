<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import PlayPauseButton from '@/components/Molecules/PlayPauseButton.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

import TrackSeeker from './Controls/TrackSeeker.vue';
import PlayerControls from './PlayerControls.vue';
import PlayerOptions from './PlayerOptions.vue';

const { currentTrack, duration, isRadioStation, isTrack } = useAudioPlayer();
</script>

<template>
  <div :class="$style.musicPlayer">
    <TrackSeeker
      v-if="!isRadioStation && duration"
      :class="['hideMobile', $style.trackSeeker]"
    />

    <div :class="['spaceBetween', 'centerItems', $style.inner]">
      <div :class="['centerItems', $style.trackDetails]">
        <ImageLink
          v-if="isTrack && 'albumId' in currentTrack && currentTrack.albumId"
          :to="`/album/${currentTrack.albumId}`"
          :title="currentTrack.name"
          :image="currentTrack.image"
          :class="$style.image"
        />

        <PreloadImage
          v-else
          :image="currentTrack.image"
          :class="$style.image"
        />

        <div>
          <p class="strong clamp mBXS">
            {{ currentTrack.name }}
          </p>

          <ArtistsList
            v-if="'artists' in currentTrack && currentTrack.artists.length"
            :artists="currentTrack.artists"
            class="smallFont clamp"
          />
        </div>
      </div>

      <PlayPauseButton class="hideDesktop" />

      <PlayerControls class="centerAll hideMobile" />

      <PlayerOptions :class="['hideMobile', $style.playerOptions]" />
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
  --inner-gap: var(--default-space);

  position: relative;
  gap: var(--inner-gap);
  padding-right: var(--default-space);

  @media (--tablet-up) {
    --inner-gap: calc(var(--default-space) * 2);

    display: grid;
    grid-template-columns: 35% auto 25%;
  }
}

.trackDetails {
  gap: var(--default-space);
}

.image {
  flex-shrink: 0;
  width: var(--media-player-height);
  height: var(--media-player-height);
}

.playerOptions {
  justify-content: end;
}

.playPauseButton,
.nextTrack {
  transform: scale(1);
}
</style>
