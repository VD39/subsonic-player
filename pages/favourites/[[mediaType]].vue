<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TrackListWithPreview from '@/components/Organisms/TrackListWithPreview.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.favourites],
});

const route = useRoute();
const { favourites, getFavourites } = useFavourite();
const { openTrackInformationModal } = useDescription();
const { addTrackToQueue, playTracks } = useAudioPlayer();

function playTrack(index: number) {
  playTracks([favourites.value!.tracks[index]], -1);
}

function addToPlaylist() {
  console.log('addToPlaylist');
}

onBeforeMount(async () => {
  await getFavourites();
});
</script>

<template>
  <h1>Favourites</h1>

  <PageNavigation :navigation="FAVOURITES_NAVIGATION" />

  <LoadingData>
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="favourites.albums"
    />

    <ArtistsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Artists"
      :artists="favourites.artists"
    />

    <TrackListWithPreview
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="favourites.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylist"
      @media-information="openTrackInformationModal"
    />
  </LoadingData>
</template>
