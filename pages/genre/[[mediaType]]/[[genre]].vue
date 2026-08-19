<script setup lang="ts">
import AlbumList from '@/components/album/AlbumList.vue';
import PageNavigation from '@/components/navigation/PageNavigation.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import TracklistGeneric from '@/components/tracklist/TracklistGeneric.vue';
import InfiniteScroller from '@/components/ui/InfiniteScroller.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.genre],
});

const route = useRoute();
const { viewLayout } = useSettings();
const { getMediaByGenre } = useGenre();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openAlbumDetailsModal, openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { fetchMoreData, hasMore } = useInfinityLoading<Album & Track>(
  `${route.params[ROUTE_PARAM_KEYS.genre.genre]}-${route.params[ROUTE_PARAM_KEYS.genre.mediaType]}`,
);
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();

const genre = safeDecodeURIComponent(
  route.params[ROUTE_PARAM_KEYS.genre.genre] as string,
);

/* istanbul ignore next -- @preserve */
function fetchData() {
  return fetchMoreData((offset: number) =>
    getMediaByGenre({
      genre,
      mediaType: route.params[
        ROUTE_PARAM_KEYS.genre.mediaType
      ] as MediaTypeParam,
      offset,
    }),
  );
}

/* istanbul ignore next -- @preserve */
const {
  data: genreData,
  refresh,
  status,
} = useAsyncData(
  route.fullPath,
  async () => {
    const genreMedia = await fetchData();

    return {
      genreMedia,
    };
  },
  {
    default: () => ({
      genreMedia: [],
    }),
  },
);

const loadingStatus = computed(() =>
  genreData.value.genreMedia.length ? 'success' : status.value,
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
  playTracks([genreData.value.genreMedia[index]]);
}

useHead({
  title: () =>
    [genre, route.params[ROUTE_PARAM_KEYS.genre.mediaType], 'Genre']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <h1 ref="title">{{ genre }}</h1>

  <PageNavigation :navigation="GENRE_NAVIGATION" />

  <LoadingData :class="viewLayout" :status="loadingStatus">
    <AlbumList
      v-if="
        route.params[ROUTE_PARAM_KEYS.genre.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums="genreData.genreMedia"
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumDetailsModal"
      @playAlbum="onPlayAlbum"
    />

    <TracklistGeneric
      v-if="
        route.params[ROUTE_PARAM_KEYS.genre.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks="genreData.genreMedia"
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
