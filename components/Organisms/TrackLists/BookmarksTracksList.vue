<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import BookmarksTracksListItem from '@/components/Organisms/TrackLists/BookmarksTracksListItem.vue';

defineProps<{
  bookmarks: Bookmark[];
}>();

defineEmits<{
  addToPlaylist: [bookmarkId: string];
  addToQueue: [bookmark: Bookmark];
  downloadMedia: [bookmark: Bookmark];
  dragStart: [bookmark: Bookmark, event: DragEvent];
  mediaInformation: [bookmark: Bookmark];
  playTrack: [index: number];
  remove: [bookmarkId: string];
}>();

const trackHeaderNames = MEDIA_LIST_COLUMN_HEADERS.bookmarkTracks;
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
      <div class="trackCell trackOptions" />
    </div>

    <BookmarksTracksListItem
      v-for="(bookmark, index) in bookmarks"
      :key="bookmark.id"
      :bookmark
      @addToPlaylist="$emit('addToPlaylist', bookmark.id)"
      @addToQueue="$emit('addToQueue', bookmark)"
      @downloadMedia="$emit('downloadMedia', bookmark)"
      @dragStart="(event) => $emit('dragStart', bookmark, event)"
      @mediaInformation="$emit('mediaInformation', bookmark)"
      @playTrack="$emit('playTrack', index)"
      @remove="$emit('remove', bookmark.id)"
    />
  </div>

  <NoMediaMessage
    v-else
    :icon="FALLBACK_ICON_BY_TYPE.podcastEpisode"
    message="No bookmarks found."
  />
</template>
