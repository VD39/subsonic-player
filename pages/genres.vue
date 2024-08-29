<script setup lang="ts">
import MediaListWrapper from '@/components/MediaLists/MediaListWrapper.vue';

const { genres, getGenres } = useGenre();

if (!genres.value?.length) {
  getGenres();
}
</script>

<template>
  <h1>Genres</h1>

  <MediaListWrapper>
    <NuxtLink
      v-for="genre in genres"
      :key="genre.name"
      :to="`/genre/albums/${genre.name}`"
      class="tileLink"
    >
      {{ genre.name }}
    </NuxtLink>
  </MediaListWrapper>
</template>
