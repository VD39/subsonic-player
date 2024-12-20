<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';

const { artists, getArtists } = useArtist();

if (!artists.value.length) {
  getArtists();
}
</script>

<template>
  <LoadingData>
    <h1>Artists</h1>

    <ArtistsList :artists="artists" />
  </LoadingData>
</template>
