<script setup lang="ts">
import ArtistLinks from '@/components/Atoms/ArtistLinks.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  track: Track;
}>();

defineEmits<{
  addToQueue: [track: Track];
  close: [];
  playTrack: [track: Track];
}>();
</script>

<template>
  <div
    class="trackPlayPauseHover centerItems searchItem"
    @click="$emit('playTrack', track)"
  >
    <TrackPlayPause
      :image="track.image"
      :trackId="track.id"
      :trackNumber="track.trackNumber"
      @playTrack="$emit('playTrack', track)"
    />

    <div class="searchName">
      <span class="clamp">{{ track.name }}</span>

      <ArtistLinks
        v-if="track.artists.length"
        :artists="track.artists"
        class="clamp smallFont"
        @click.stop="$emit('close')"
      />
    </div>

    <ButtonLink
      ref="addToQueueButtonLink"
      :icon="ICONS.add"
      title="Add to queue"
      @click.stop="$emit('addToQueue', track)"
    >
      Add to queue
    </ButtonLink>
  </div>
</template>
