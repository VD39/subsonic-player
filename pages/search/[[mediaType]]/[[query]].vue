<script setup lang="ts">
import AlbumList from '@/components/album/AlbumList.vue';
import ArtistList from '@/components/artist/ArtistList.vue';
import PageNavigation from '@/components/navigation/PageNavigation.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import TracklistGeneric from '@/components/tracklist/TracklistGeneric.vue';
import InfiniteScroller from '@/components/ui/InfiniteScroller.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.search],
});

const route = useRoute();
const { viewLayout } = useSettings();
const { addToPlaylistModal } = usePlaylist();
const { fetchSearchResult } = useSearch();
const { openAlbumDetailsModal, openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { downloadTrack } = useMediaLibrary();
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();
const { fetchMoreData, hasMore } = useInfinityLoading<SearchResultByType>(
  `search-${route.params[ROUTE_PARAM_KEYS.search.mediaType]}-${route.params[ROUTE_PARAM_KEYS.search.query]}`,
);

const query = replaceCharacterWithSpace(
  normaliseStringToWords(route.params[ROUTE_PARAM_KEYS.search.query] as string),
);

/* istanbul ignore next -- @preserve */
function fetchData(mediaType: MediaTypeParam) {
  return fetchMoreData((offset: number) =>
    fetchSearchResult({
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

async function addAlbumToQueue(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    playTracks(tracks);
  }
}

function onPlayTrack(index: number) {
  playTracks([
    (searchResultsData.value.searchResults as PlayableTrack[])[index],
  ]);
}

const loadingStatus = computed(() =>
  searchResultsData.value.searchResults.length ? 'success' : status.value,
);

const albums = computed(() => searchResultsData.value.searchResults as Album[]);

const artists = computed(
  () => searchResultsData.value.searchResults as Artist[],
);

const tracks = computed(() => searchResultsData.value.searchResults as Track[]);

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
    <AlbumList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumDetailsModal"
      @playAlbum="onPlayAlbum"
    />

    <ArtistList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Artists
      "
      :artists
    />

    <TracklistGeneric
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadTrack"
      @dragStart="dragStart"
      @mediaInformation="openTrackDetailsModal"
      @playTrack="onPlayTrack"
    />

    <InfiniteScroller
      :hasMore
      :loading="status === 'pending'"
      @loadMore="refresh"
    />
  </LoadingData>
</template>
