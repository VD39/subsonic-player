<script setup lang="ts">
import PageNavigation from '@/components/Navigation/PageNavigation.vue';
import AlbumsList from '@/components/MediaLists/AlbumsList.vue';
import TrackListWithPreview from '@/components/MediaLists/TrackListWithPreview.vue';
import InfiniteScroller from '@/components/InfiniteScroller/InfiniteScroller.vue';

definePageMeta({
  middleware: ['genre'],
});

const route = useRoute();
const { getMediaByGenre } = useGenre();
const { items, fetchMoreData } = useInfinityLoading<Track & Album>();

function fetchData() {
  fetchMoreData(
    async (offset: number) =>
      await getMediaByGenre({
        mediaType: route.params.mediaType as string,
        genre: route.params.genre as string,
        offset,
      }),
  );
}
</script>

<template>
  <h1>Genre</h1>

  <PageNavigation :navigation="GENRE_NAVIGATION" />

  <AlbumsList v-if="route.params.mediaType === 'albums'" :albums="items" />

  <TrackListWithPreview
    v-if="route.params.mediaType === 'tracks'"
    :tracks="items"
  />

  <InfiniteScroller @load-more="fetchData" />
</template>
