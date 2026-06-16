<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import BookmarksTracksList from '@/components/Organisms/TrackLists/BookmarksTracksList.vue';

const { dragStart } = useDragAndDrop();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { bookmarks, deleteBookmark, getBookmarks } = useBookmark();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_KEYS.bookmarks,
  async () => {
    if (!bookmarks.value.length) {
      await getBookmarks();
    }

    return {
      bookmarks: bookmarks.value,
    };
  },
  {
    default: () => ({
      bookmarks: [],
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

function playEpisodeFromBookmarks(index: number) {
  playTracks([bookmarks.value[index]]);
}

useHead({
  title: 'Bookmarks',
});
</script>

<template>
  <HeaderWithAction>
    <h1 ref="title">Bookmarks ({{ bookmarks.length }})</h1>

    <template #actions>
      <RefreshButton :status @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <p>
    Automatic bookmarks are created exclusively for podcasts, allowing you to
    effortlessly resume playback from your last position. This feature is
    compatible with all supported apps.
  </p>

  <LoadingData :status>
    <BookmarksTracksList
      :bookmarks
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadTrack"
      @dragStart="dragStart"
      @mediaInformation="openTrackInformationModal"
      @playTrack="playEpisodeFromBookmarks"
      @remove="deleteBookmark"
    />
  </LoadingData>
</template>
