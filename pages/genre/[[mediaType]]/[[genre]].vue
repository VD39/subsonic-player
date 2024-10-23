<script setup lang="ts">
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import TrackListWithPreview from '@/components/Organisms/TrackListWithPreview.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.genre],
});

const route = useRoute();
const { getMediaByGenre } = useGenre();
const { openTrackInformationModal } = useDescription();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { fetchMoreData, items } = useInfinityLoading<Album & Track>();

function playTrack(index: number) {
  playTracks([items.value[index]], -1);
}

function addToPlaylist() {
  console.log('addToPlaylist');
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
</script>

<template>
  <h1>{{ route.params.genre }}</h1>

  <PageNavigation :navigation="GENRE_NAVIGATION" />

  <LoadingData>
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="items"
    />

    <TrackListWithPreview
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="items"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylist"
      @media-information="openTrackInformationModal"
    />

    <InfiniteScroller @load-more="fetchData" />
  </LoadingData>
</template>
