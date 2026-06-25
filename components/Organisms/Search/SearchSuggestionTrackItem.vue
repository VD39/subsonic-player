<script setup lang="ts">
import ArtistLinks from '@/components/Atoms/ArtistLinks.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

const props = defineProps<{
  track: Track;
}>();

const emit = defineEmits<{
  addToQueue: [track: Track];
  close: [];
  playTrack: [track: Track];
}>();

const { isCurrentTrack } = useQueue();

function onPlayTrack() {
  if (isCurrentTrack(props.track.id)) {
    return;
  }

  emit('playTrack', props.track);
}
</script>

<template>
  <div
    class="trackPlayPauseHover centerItems searchItem"
    @click.prevent="onPlayTrack"
  >
    <TrackPlayPause
      :image="track.image"
      :trackId="track.id"
      :trackNumber="track.trackNumber"
      @playTrack="onPlayTrack"
    />

    <div class="searchName">
      <span class="clamp">{{ track.name }}</span>

      <div class="clampWrapper">
        <ArtistLinks
          v-if="track.artists.length"
          :artists="track.artists"
          class="clamp smallFont noTouchEventsMobile"
          @click.stop="$emit('close')"
        />
      </div>
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
