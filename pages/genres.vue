<script setup lang="ts">
import GenreLink from '@/components/Atoms/GenreLink.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';

const { genres, getGenres } = useGenre();

if (!genres.value.length) {
  getGenres();
}

useHead({
  title: 'Genres',
});
</script>

<template>
  <LoadingData>
    <h1>Genres</h1>

    <MediaListWrapper>
      <GenreLink v-for="genre in genres" :key="genre.name" :name="genre.name" />
    </MediaListWrapper>
  </LoadingData>
</template>
