<script setup lang="ts">
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

  <div v-if="items.length">
    <div v-for="item in items" :key="item.name">
      <pre>{{ item.name }}</pre>
    </div>
  </div>

  <InfiniteScroller @load-more="fetchData" />
</template>
