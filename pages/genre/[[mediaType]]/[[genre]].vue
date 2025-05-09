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
const { getMediaByGenre } = useGenre();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { fetchMoreData, hasMore } = useInfinityLoading<Album & Track>(
  `${route.params[ROUTE_PARAM_KEYS.genre.genre]}-${route.params[ROUTE_PARAM_KEYS.genre.mediaType]}`,
);

const genre = decodeURIComponent(
  route.params[ROUTE_PARAM_KEYS.genre.genre] as string,
);

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

function playTrack(index: number) {
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
  <h1>{{ genre }}</h1>

  <PageNavigation :navigation="GENRE_NAVIGATION" />

  <LoadingData :status="loadingStatus">
    <AlbumsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.genre.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums="genreData.genreMedia"
    />

    <TracksList
      v-if="
        route.params[ROUTE_PARAM_KEYS.genre.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks="genreData.genreMedia"
      @add-to-playlist="addToPlaylistModal"
      @add-to-queue="addTrackToQueue"
      @download-media="downloadMedia"
      @media-information="openTrackInformationModal"
      @play-track="playTrack"
    />

    <InfiniteScroller
      :has-more="hasMore"
      :loading="status === 'pending'"
      @load-more="refresh"
    />
  </LoadingData>
</template>
