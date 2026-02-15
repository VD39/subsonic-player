<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import BookmarksTracksListItem from '@/components/Organisms/TrackLists/BookmarksTracksListItem.vue';

defineProps<{
  bookmarks: Bookmark[];
}>();

defineEmits<{
  addToPlaylist: [bookmarkId: string];
  downloadMedia: [bookmark: Bookmark];
  mediaInformation: [bookmark: Bookmark];
  playTrack: [index: number];
  remove: [bookmarkId: string];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.bookmarkTracks;
</script>

<template>
  <div
    v-if="bookmarks.length"
    ref="tracksWrapper"
    class="trackTable withPreview"
  >
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[1] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[2] }}</div>
      <div ref="trackTime" class="trackCell trackTime withPosition">
        {{ trackHeaderNames[3] }}
      </div>
      <div class="trackCell trackOptions" />
      <div class="trackCell trackOptions" />
    </div>

    <BookmarksTracksListItem
      v-for="(bookmark, index) in bookmarks"
      :key="bookmark.id"
      :bookmark
      @addToPlaylist="$emit('addToPlaylist', bookmark.id)"
      @downloadMedia="$emit('downloadMedia', bookmark)"
      @mediaInformation="$emit('mediaInformation', bookmark)"
      @playTrack="$emit('playTrack', index)"
      @remove="$emit('remove', bookmark.id)"
    />
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.podcastEpisode"
    message="No bookmarks found."
  />
</template>
