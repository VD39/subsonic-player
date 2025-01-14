<script setup lang="ts">
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import TrackWithPreviewList from '@/components/Organisms/TrackWithPreviewList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.genre],
});

const route = useRoute();
const { getMediaByGenre } = useGenre();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useDescription();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { fetchMoreData, hasMore, items, loading } = useInfinityLoading<
  Album & Track
>();

function playTrack(index: number) {
  playTracks([items.value[index]], -1);
}

function fetchData() {
  fetchMoreData(
    async (offset: number) =>
      await getMediaByGenre({
        genre: route.params.genre as string,
        mediaType: route.params.mediaType as MediaTypeParam,
        offset,
      }),
  );
}

useHead({
  title: () =>
    [route.params.genre || '', route.params.mediaType || '', 'Genre']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <h1>{{ route.params.genre }}</h1>

  <PageNavigation :navigation="GENRE_NAVIGATION" />

  <LoadingData>
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="items"
    />

    <TrackWithPreviewList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="items"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylistModal"
      @media-information="openTrackInformationModal"
      @download-media="downloadMedia"
    />

    <InfiniteScroller
      :has-more="hasMore"
      :loading="loading"
      @load-more="fetchData"
    />
  </LoadingData>
</template>
