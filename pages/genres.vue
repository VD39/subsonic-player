<script setup lang="ts">
import GenreLink from '@/components/Atoms/GenreLink.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';

const { getGenres } = useGenre();

const { data: genresData, status } = useAsyncData(
  ASYNC_DATA_NAMES.genres,
  async () => {
    const genres = await getGenres();

    return {
      genres,
    };
  },
  {
    default: () => ({
      genres: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

useHead({
  title: 'Genres',
});
</script>

<template>
  <h1>Genres</h1>

  <LoadingData :status="status">
    <MediaListWrapper>
      <GenreLink
        v-for="genre in genresData.genres"
        :key="genre.name"
        :name="genre.name"
      />
    </MediaListWrapper>
  </LoadingData>
</template>
