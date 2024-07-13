<script setup lang="ts">
import TrackDetails from '@/components/Queue/TrackDetail.vue';
import TrackSeeker from './Controls/TrackSeeker.vue';
import PlayerControls from './PlayerControls.vue';
import PlayerOptions from './PlayerOptions.vue';
import PlayPauseButton from './Controls/PlayPauseButton.vue';

const { currentTrack } = useAudioPlayer();
</script>

<template>
  <div :class="$style.musicPlayer">
    <TrackSeeker :class="$style.seeker" />

    <div :class="$style.inner">
      <TrackDetails :track="currentTrack" in-media-player />

      <div :class="$style.mobile">
        <PlayPauseButton />
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

  @media screen and (--tablet-up) {
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

  @media screen and (--tablet-up) {
    display: grid;
    grid-template-columns: 25% auto 25%;
    gap: calc(var(--media-player-spacing) * 2);
  }
}

.mobile {
  display: flex;

  @media screen and (--tablet-up) {
    display: none;
  }
}

.playerControls {
  justify-content: center;

  @media screen and (--mobile-only) {
    display: none;
  }
}

.playerOptions {
  justify-content: flex-end;

  @media screen and (--mobile-only) {
    display: none;
  }
}
</style>
