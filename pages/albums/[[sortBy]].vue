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
const { dragStart } = useDragAndDrop();
const { viewLayout } = useViewLayout();
const { fetchMoreData, hasMore } = useInfinityLoading<Album>(
  route.params[ROUTE_PARAM_KEYS.albums.sortBy] as string,
);

/* istanbul ignore next -- @preserve */
function fetchData() {
  return fetchMoreData((offset: number) =>
    getAlbums({
      offset,
      type: route.params[ROUTE_PARAM_KEYS.albums.sortBy] as AlbumSortBy,
    }),
  );
}

/* istanbul ignore next -- @preserve */
const {
  data: albumsData,
  refresh,
  status,
} = useAsyncData(
  route.fullPath,
  async () => {
    const albums = await fetchData();

    return {
      albums,
    };
  },
  {
    default: () => ({
      albums: [],
    }),
  },
);

const loadingStatus = computed(() =>
  albumsData.value.albums.length ? 'success' : status.value,
);

useHead({
  title: () =>
    [route.params[ROUTE_PARAM_KEYS.albums.sortBy], 'Albums']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <h1>Albums</h1>

  <PageNavigation :navigation="ALBUMS_NAVIGATION" />

  <LoadingData :class="viewLayout" :status="loadingStatus">
    <AlbumsList :albums="albumsData.albums" @dragStart="dragStart" />

    <InfiniteScroller
      :hasMore
      :loading="status === 'pending'"
      @loadMore="refresh"
    />
  </LoadingData>
</template>
