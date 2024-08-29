<script setup lang="ts">
import PageNavigation from '@/components/Navigation/PageNavigation.vue';
import AlbumsList from '@/components/MediaLists/AlbumsList.vue';
import ArtistsList from '@/components/MediaLists/ArtistsList.vue';
import TrackListWithPreview from '@/components/MediaLists/TrackListWithPreview.vue';

definePageMeta({
  middleware: ['favourites'],
});

const route = useRoute();
const { favourites, getFavourites } = useFavourite();

getFavourites();
</script>

<template>
  <h1>Favourites</h1>

  <PageNavigation :navigation="FAVOURITES_NAVIGATION" />

  <AlbumsList
    v-if="route.params.mediaType === 'albums'"
    :albums="favourites.albums"
  />

  <ArtistsList
    v-if="route.params.mediaType === 'artists'"
    :artists="favourites.artists"
  />

  <TrackListWithPreview
    v-if="route.params.mediaType === 'tracks'"
    :tracks="favourites.tracks"
  />
</template>
