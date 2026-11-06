<script setup lang="ts">
import AlbumList from '@/components/album/AlbumList.vue';
import ArtistList from '@/components/artist/ArtistList.vue';
import PageNavigation from '@/components/navigation/PageNavigation.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import TracklistGeneric from '@/components/tracklist/TracklistGeneric.vue';
import HeaderWithAction from '@/components/ui/HeaderWithAction.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.favourites],
});

const route = useRoute();
const { viewLayout } = useSettings();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { favourites, getFavourites } = useFavourite();
const { openAlbumDetailsModal, openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();
const { getMediaTracks } = useMediaTracks();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_KEYS.favourites,
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
    addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    playTracks(tracks);
  }
}

function onPlayTrack(index: number) {
  playTracks(favourites.value!.tracks, index);
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
    <AlbumList
      v-if="
        route.params[ROUTE_PARAM_KEYS.favourites.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Albums
      "
      :albums="favourites.albums"
      @addToQueue="addAlbumToQueue"
      @dragStart="dragStart"
      @mediaInformation="openAlbumDetailsModal"
      @playAlbum="onPlayAlbum"
    />

    <ArtistList
      v-if="
        route.params[ROUTE_PARAM_KEYS.favourites.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Artists
      "
      :artists="favourites.artists"
    />

    <TracklistGeneric
      v-if="
        route.params[ROUTE_PARAM_KEYS.favourites.mediaType] ===
        ROUTE_MEDIA_TYPE_PARAMS.Tracks
      "
      :tracks="favourites.tracks"
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadTrack"
      @dragStart="dragStart"
      @mediaInformation="openTrackDetailsModal"
      @playTrack="onPlayTrack"
    />
  </LoadingData>
</template>
