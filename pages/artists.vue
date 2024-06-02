<script setup lang="ts">
const { artists, getArtists } = useArtist();

if (!artists.value.length) {
  getArtists();
}
</script>

<template>
  <h1>Artists</h1>

  <div v-for="artist in artists" :key="artist.id">
    <NuxtLink :to="`/artist/${artist.id}`">
      {{ artist.name }}
    </NuxtLink>
  </div>
</template>
