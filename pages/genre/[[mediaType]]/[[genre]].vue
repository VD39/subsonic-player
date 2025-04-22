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
  `${route.params.genre}-${route.params.mediaType}`,
);

function fetchData() {
  return fetchMoreData((offset: number) =>
    getMediaByGenre({
      genre: route.params.genre as string,
      mediaType: route.params.mediaType as MediaTypeParam,
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
    [route.params.genre, route.params.mediaType, 'Genre']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <h1>{{ route.params.genre }}</h1>

  <PageNavigation :navigation="GENRE_NAVIGATION" />

  <LoadingData :status="loadingStatus">
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="genreData.genreMedia"
    />

    <TracksList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
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
