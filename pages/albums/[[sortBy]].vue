<script setup lang="ts">
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

  <NuxtLink :to="`/album/al-457`"> al-457 </NuxtLink>

  <NuxtLink :to="`/album/unknown`"> unknown </NuxtLink>

  <br />
  <br />

  <div v-if="items.length">
    <div v-for="item in items" :key="item.name">
      <NuxtLink :to="`/album/${item.id}`">
        <pre>{{ item.year }}</pre>
      </NuxtLink>
    </div>
  </div>

  <InfiniteScroller @load-more="fetchData" />
</template>
