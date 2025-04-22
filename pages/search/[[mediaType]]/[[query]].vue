<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.search],
});

const route = useRoute();
const { addToPlaylistModal } = usePlaylist();
const { search } = useSearch();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { downloadMedia } = useMediaLibrary();

const query = replaceCharactersWithSpace(
  sanitiseString(route.params.query as string),
);

const { data: searchResultsData, status } = useAsyncData(
  route.fullPath,
  async () => {
    const searchResults = await search({
      offset: 0,
      query,
    });

    return {
      searchResults,
    };
  },
  {
    default: () => ({
      searchResults: DEFAULT_ALL_MEDIA,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playTrack(index: number) {
  playTracks([searchResultsData.value.searchResults!.tracks[index]], -1);
}

useHead({
  title: () =>
    [query, route.params.mediaType, 'Search'].filter(Boolean).join(' - '),
});
</script>

<template>
  <h1>Search results for: {{ convertToTitleCase(query) }}</h1>

  <PageNavigation :navigation="SEARCH_NAVIGATION" />

  <LoadingData :status="status">
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="searchResultsData.searchResults.albums"
    />

    <ArtistsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Artists"
      :artists="searchResultsData.searchResults.artists"
    />

    <TracksList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="searchResultsData.searchResults.tracks"
      @add-to-playlist="addToPlaylistModal"
      @add-to-queue="addTrackToQueue"
      @download-media="downloadMedia"
      @media-information="openTrackInformationModal"
      @play-track="playTrack"
    />
  </LoadingData>
</template>
