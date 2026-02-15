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
const { addTracksToQueue, playTracks } = useAudioPlayer();
const { openAlbumInformationModal } = useMediaInformation();
const { getMediaTracks } = useMediaTracks();
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

async function addAlbumToQueue(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    await addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    await playTracks(tracks);
  }
}

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
    <AlbumsList
      :albums="albumsData.albums"
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumInformationModal"
      @playAlbum="onPlayAlbum"
    />

    <InfiniteScroller
      :hasMore
      :loading="status === 'pending'"
      @loadMore="refresh"
    />
  </LoadingData>
</template>
