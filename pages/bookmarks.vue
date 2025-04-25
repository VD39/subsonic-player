<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import BookmarksTracksList from '@/components/Organisms/TrackLists/BookmarksTracksList.vue';

const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks, setCurrentTime } = useAudioPlayer();
const { bookmarks, deleteBookmark, getBookmarks } = useBookmarks();

const { refresh, status } = useAsyncData(
  ASYNC_DATA_NAMES.bookmarks,
  async () => {
    await getBookmarks();

    return {
      bookmarks: bookmarks.value,
    };
  },
  {
    default: () => ({
      bookmarks: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

async function playEpisodeFromBookmarks(index: number) {
  playTracks([bookmarks.value[index]], -1);
  setCurrentTime(bookmarks.value[index].position);
}

useHead({
  title: 'Bookmarks',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Bookmarks ({{ bookmarks.length }})</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <p>
    Automatic bookmarks are created exclusively for podcasts, allowing you to
    effortlessly resume playback from your last position. This feature is
    compatible with all supported apps.
  </p>

  <LoadingData :status="status">
    <BookmarksTracksList
      :bookmarks="bookmarks"
      @add-to-playlist="addToPlaylistModal"
      @add-to-queue="addTrackToQueue"
      @download-media="downloadMedia"
      @media-information="openTrackInformationModal"
      @play-track="playEpisodeFromBookmarks"
      @remove="deleteBookmark"
    />
  </LoadingData>
</template>
