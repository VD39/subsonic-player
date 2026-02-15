<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import AlbumTracksListItem from '@/components/Organisms/TrackLists/AlbumTracksListItem.vue';

defineProps<{
  tracks: Track[];
}>();

defineEmits<{
  addToPlaylist: [trackId: string];
  addToQueue: [track: Track];
  downloadMedia: [track: Track];
  dragStart: [track: Track, event: DragEvent];
  mediaInformation: [track: Track];
  playTrack: [index: number];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.albumTracks;
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[1] }}</div>
      <div class="trackCell trackTime">{{ trackHeaderNames[2] }}</div>
      <div class="trackCell trackOptions" />
    </div>

    <AlbumTracksListItem
      v-for="track in tracks"
      :key="track.id"
      :track
      @addToPlaylist="$emit('addToPlaylist', track.id)"
      @addToQueue="$emit('addToQueue', track)"
      @downloadMedia="$emit('downloadMedia', track)"
      @dragStart="(event) => $emit('dragStart', track, event)"
      @mediaInformation="$emit('mediaInformation', track)"
      @playTrack="$emit('playTrack', track.index)"
    />
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.track"
    message="No tracks found."
  />
</template>
