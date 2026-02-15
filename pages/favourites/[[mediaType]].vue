<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.favourites],
});

const route = useRoute();
const { viewLayout } = useViewLayout();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { favourites, getFavourites } = useFavourite();
const { openAlbumInformationModal, openTrackInformationModal } =
  useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_NAMES.favourites,
  async () => {
    await getFavourites();

    return {
      favourites: favourites.value,
    };
  },
  {
    default: () => ({
      favourites: DEFAULT_ALL_MEDIA,
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
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

function onPlayTrack(index: number) {
  playTracks(favourites.value!.tracks, index - 1);
}

useHead({
  title: () =>
    [route.params[ROUTE_PARAM_KEYS.favourites.mediaType], 'Favourites']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <HeaderWithAction>
    <h1>Favourites</h1>

    <template #actions>
      <RefreshButton :status @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <PageNavigation :navigation="FAVOURITES_NAVIGATION" />

  <LoadingData :class="viewLayout" :status>
    <AlbumsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.favourites.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums="favourites.albums"
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumInformationModal"
      @playAlbum="onPlayAlbum"
    />

    <ArtistsList
      v-if="
        route.params[ROUTE_PARAM_KEYS.favourites.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Artists
      "
      :artists="favourites.artists"
    />

    <TracksList
      v-if="
        route.params[ROUTE_PARAM_KEYS.favourites.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks="favourites.tracks"
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadMedia"
      @dragStart="dragStart"
      @mediaInformation="openTrackInformationModal"
      @playTrack="onPlayTrack"
    />
  </LoadingData>
</template>
