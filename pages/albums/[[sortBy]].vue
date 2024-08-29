<script setup lang="ts">
import PageNavigation from '@/components/Navigation/PageNavigation.vue';
import AlbumsList from '@/components/MediaLists/AlbumsList.vue';
import InfiniteScroller from '@/components/InfiniteScroller/InfiniteScroller.vue';

definePageMeta({
  middleware: ['albums'],
});

const route = useRoute();
const { getAlbums } = useAlbum();
const { items, fetchMoreData } = useInfinityLoading<Album>();

function fetchData() {
  fetchMoreData(
    async (offset: number) =>
      await getAlbums({
        type: route.params.sortBy as SortByType,
        offset,
      }),
  );
}
</script>

<template>
  <h1>Albums</h1>

  <PageNavigation :navigation="ALBUMS_NAVIGATION" />

  <AlbumsList :albums="items" />

  <InfiniteScroller @load-more="fetchData" />
</template>

<style module>
.figure {
  margin-bottom: var(--space-8);
}
</style>
