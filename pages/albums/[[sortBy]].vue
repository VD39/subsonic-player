<script setup lang="ts">
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.albums],
});

const route = useRoute();
const { getAlbums } = useAlbum();
const { fetchMoreData, items } = useInfinityLoading<Album>();

function fetchData() {
  fetchMoreData(
    async (offset: number) =>
      await getAlbums({
        offset,
        type: route.params.sortBy as AlbumSortBy,
      }),
  );
}
</script>

<template>
  <h1>Albums</h1>

  <PageNavigation :navigation="ALBUMS_NAVIGATION" />

  <LoadingData>
    <AlbumsList :albums="items" />

    <InfiniteScroller @load-more="fetchData" />
  </LoadingData>
</template>
