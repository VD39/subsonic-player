<script setup lang="ts">
import ArtistsList from '@/components/MediaLists/ArtistsList.vue';

const { artists, getArtists } = useArtist();

if (!artists.value.length) {
  getArtists();
}
</script>

<template>
  <h1>Artists</h1>

  <ArtistsList :artists="artists" />
</template>
