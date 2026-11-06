<script setup lang="ts">
import AlbumList from '@/components/album/AlbumList.vue';
import PageNavigation from '@/components/navigation/PageNavigation.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import InfiniteScroller from '@/components/ui/InfiniteScroller.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.albums],
});

const route = useRoute();
const { getAlbums } = useAlbum();
const { dragStart } = useDragAndDrop();
const { viewLayout } = useSettings();
const { addTracksToQueue, playTracks } = useAudioPlayer();
const { openAlbumDetailsModal } = useMediaInformation();
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
    addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    playTracks(tracks);
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
    <AlbumList
      :albums="albumsData.albums"
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumDetailsModal"
      @playAlbum="onPlayAlbum"
    />

    <InfiniteScroller
      :hasMore
      :loading="status === 'pending'"
      @loadMore="refresh"
    />
  </LoadingData>
</template>
