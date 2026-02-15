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
const { openAlbumInformationModal, openTrackInformationModal } =
  useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { downloadMedia } = useMediaLibrary();
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();
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

async function addAlbumToQueue(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    await addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    await playTracks(tracks);
  }
}

function onPlayTrack(index: number) {
  playTracks(
    [(searchResultsData.value.searchResults as MixedTrack[])[index]],
    -1,
  );
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
    <AlbumsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumInformationModal"
      @playAlbum="onPlayAlbum"
    />

    <ArtistsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Artists
      "
      :artists
    />

    <TracksList
      v-if="
        route.params[ROUTE_PARAM_KEYS.search.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadMedia"
      @dragStart="dragStart"
      @mediaInformation="openTrackInformationModal"
      @playTrack="onPlayTrack"
    />

    <InfiniteScroller
      :hasMore
      :loading="status === 'pending'"
      @loadMore="refresh"
    />
  </LoadingData>
</template>
