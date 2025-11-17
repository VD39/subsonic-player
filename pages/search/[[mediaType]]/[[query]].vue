<script setup lang="ts">
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.search],
});

const route = useRoute();
const { viewLayout } = useViewLayout();
const { addToPlaylistModal } = usePlaylist();
const { search } = useSearch();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { downloadMedia } = useMediaLibrary();
const { dragStart } = useDragAndDrop();
const { fetchMoreData, hasMore } = useInfinityLoading<SearchResultByType>(
  `search-${route.params[ROUTE_PARAM_KEYS.search.mediaType]}-${route.params[ROUTE_PARAM_KEYS.search.query]}`,
);

const query = replaceCharactersWithSpace(
  sanitiseString(route.params[ROUTE_PARAM_KEYS.search.query] as string),
);

/* istanbul ignore next -- @preserve */
function fetchData(mediaType: MediaTypeParam) {
  return fetchMoreData((offset: number) =>
    search({
      mediaType,
      offset,
      query,
    }),
  );
}

/* istanbul ignore next -- @preserve */
const {
  data: searchResultsData,
  refresh,
  status,
} = useAsyncData(
  route.fullPath,
  async () => {
    const mediaType = route.params[ROUTE_PARAM_KEYS.search.mediaType];
    const searchResults = await fetchData(mediaType as MediaTypeParam);

    return {
      searchResults,
    };
  },
  {
    default: () => ({
      searchResults: [],
    }),
  },
);

const loadingStatus = computed(() =>
  searchResultsData.value.searchResults.length ? 'success' : status.value,
);

function playTrack(index: number) {
  playTracks(
    [(searchResultsData.value.searchResults as MixedTrack[])[index]],
    -1,
  );
}

useHead({
  title: () =>
    [query, route.params[ROUTE_PARAM_KEYS.search.mediaType], 'Search']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <h1 ref="title">Search results for: {{ convertToTitleCase(query) }}</h1>

  <PageNavigation :navigation="SEARCH_NAVIGATION" />

  <LoadingData :class="viewLayout" :status="loadingStatus">
    <AlbumsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums="searchResultsData.searchResults as Album[]"
      @dragStart="dragStart"
    />

    <ArtistsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Artists
      "
      :artists="searchResultsData.searchResults as Artist[]"
    />

    <TracksList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks="searchResultsData.searchResults as Track[]"
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadMedia"
      @dragStart="dragStart"
      @mediaInformation="openTrackInformationModal"
      @playTrack="playTrack"
    />

    <InfiniteScroller
      :hasMore
      :loading="status === 'pending'"
      @loadMore="refresh"
    />
  </LoadingData>
</template>
