<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TrackWithPreviewList from '@/components/Organisms/TrackWithPreviewList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.favourites],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { getFavourites } = useFavourite();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

const {
  data: favouritesData,
  refresh,
  status,
} = useAsyncData(
  ASYNC_DATA_NAMES.favourites,
  async () => {
    const favourites = await getFavourites();

    return {
      favourites,
    };
  },
  {
    default: () => ({
      favourites: DEFAULT_ALL_MEDIA,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playTrack(index: number) {
  playTracks([favouritesData.value.favourites!.tracks[index]], -1);
}

useHead({
  title: () =>
    [route.params.mediaType, 'Favourites'].filter(Boolean).join(' - '),
});
</script>

<template>
  <HeaderWithAction>
    <h1>Favourites</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <PageNavigation :navigation="FAVOURITES_NAVIGATION" />

  <LoadingData :status="status">
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="favouritesData.favourites.albums"
    />

    <ArtistsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Artists"
      :artists="favouritesData.favourites.artists"
    />

    <TrackWithPreviewList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="favouritesData.favourites.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylistModal"
      @media-information="openTrackInformationModal"
      @download-media="downloadMedia"
    />
  </LoadingData>
</template>
