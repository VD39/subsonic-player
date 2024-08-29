<script setup lang="ts">
import ImageLink from '@/components/Image/ImageLink.vue';
import PreloadImage from '@/components/Image/PreloadImage.vue';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import TrackSeeker from './Controls/TrackSeeker.vue';
import PlayerControls from './PlayerControls.vue';
import PlayerOptions from './PlayerOptions.vue';
// import PlayPauseButton from './Controls/PlayPauseButton.vue';

const { currentTrack, isTrack } = useAudioPlayer();
</script>

<template>
  <div :class="$style.musicPlayer">
    <TrackSeeker :class="$style.seeker" />

    <div :class="$style.inner">
      <div :class="$style.trackDetails">
        <ImageLink
          v-if="isTrack"
          :to="`/album/${currentTrack.id}`"
          :title="currentTrack.name"
          :image="currentTrack.image"
          :class="$style.imageLink"
        />
        <PreloadImage
          v-else
          :image="currentTrack.image"
          :class="$style.imageLink"
        />

        <div>
          <p class="strong">{{ currentTrack.name }}</p>

          <ArtistsList
            v-if="'artists' in currentTrack && currentTrack.artists.length"
            :artists="currentTrack.artists"
          />
        </div>
      </div>

      <PlayerControls :class="$style.playerControls" />

      <PlayerOptions :class="$style.playerOptions" />
    </div>
  </div>
</template>

<style module>
.musicPlayer {
  position: fixed;
  inset: auto 0 var(--header-height);
  z-index: 3;
  height: var(--media-player-height);
  max-height: var(--media-player-height);
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  box-shadow: var(--dark-box-shadow-medium);

  @media (--tablet-up) {
    bottom: 0;
  }
}

.seeker {
  position: absolute;
  z-index: 3;
  width: 100%;
  transform: translateY(-50%);
}

.inner {
  @mixin align-center;

  gap: var(--media-player-spacing);
  justify-content: space-between;
  padding-right: var(--media-player-spacing);

  @media (--tablet-up) {
    display: grid;
    grid-template-columns: 25% auto 25%;
    gap: calc(var(--media-player-spacing) * 2);
  }
}

.trackDetails {
  @mixin align-center;

  gap: var(--media-player-spacing);
}

.imageLink {
  flex-shrink: 0;
  width: var(--media-player-height);
  height: var(--media-player-height);
}

.playerControls {
  justify-content: center;
}

.playerOptions {
  justify-content: flex-end;
}

.playerControls,
.playerOptions {
  @media screen and (--mobile-only) {
    display: none;
  }
}
</style>
