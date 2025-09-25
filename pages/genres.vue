<script setup lang="ts">
import GenreLink from '@/components/Atoms/GenreLink.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';

const { getGenres } = useGenre();

/* istanbul ignore next -- @preserve */
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

  <LoadingData :status>
    <MediaListWrapper
      v-if="genresData.genres.length"
      ref="genresMediaListWrapper"
    >
      <GenreLink
        v-for="genre in genresData.genres"
        :key="genre.name"
        data-test-id="genre-item"
        :name="genre.name"
      />
    </MediaListWrapper>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.genre"
      message="No genres found."
    />
  </LoadingData>
</template>
