<script setup lang="ts">
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.genre],
});

const route = useRoute();
const { viewLayout } = useViewLayout();
const { getMediaByGenre } = useGenre();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openAlbumInformationModal, openTrackInformationModal } =
  useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { fetchMoreData, hasMore } = useInfinityLoading<Album & Track>(
  `${route.params[ROUTE_PARAM_KEYS.genre.genre]}-${route.params[ROUTE_PARAM_KEYS.genre.mediaType]}`,
);
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();

const genre = decodeURIComponent(
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
  playTracks([genreData.value.genreMedia[index]], -1);
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
    <AlbumsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.genre.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums="genreData.genreMedia"
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumInformationModal"
      @playAlbum="onPlayAlbum"
    />

    <TracksList
      v-if="
        route.params[ROUTE_PARAM_KEYS.genre.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks="genreData.genreMedia"
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
