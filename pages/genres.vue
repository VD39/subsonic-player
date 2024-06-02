<script setup lang="ts">
const { genres, getGenres } = useGenre();

if (!genres.value?.length) {
  getGenres();
}
</script>

<template>
  <h1>Genres</h1>

  <div v-if="genres.length">
    <div v-for="genre in genres" :key="genre.name">
      <RouterLink :to="`/genre/albums/${genre.name}`">
        albums: {{ genre.name }}
      </RouterLink>
      <br />
      <RouterLink :to="`/genre/tracks/${genre.name}`">
        tracks: {{ genre.name }}
      </RouterLink>
    </div>
  </div>
</template>
