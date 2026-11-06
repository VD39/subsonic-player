<script setup lang="ts">
import GenreLink from '@/components/artist/GenreLink.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import GridWrapper from '@/components/ui/GridWrapper.vue';
import SortControls from '@/components/ui/SortControls.vue';

const { getGenres } = useGenre();

/* istanbul ignore next -- @preserve */
const { data: genresData, status } = useAsyncData(
  ASYNC_DATA_KEYS.genres,
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

const { sortedItems: sortedGenres, sortProps } = useLocalSort<Genre>({
  items: computed(() => genresData.value.genres || []),
  options: [
    {
      defaultDirection: 'desc',
      key: 'albumCount',
      label: 'Album Count',
    },
    {
      defaultDirection: 'desc',
      key: 'trackCount',
      label: 'Track Count',
    },
  ],
});

useHead({
  title: 'Genres',
});
</script>

<template>
  <h1>Genres</h1>

  <LoadingData :status>
    <SortControls v-bind="sortProps" />

    <GridWrapper v-if="sortedGenres.length">
      <GenreLink
        v-for="genre in sortedGenres"
        :key="genre.name"
        data-test-id="genre-item"
        :name="genre.name"
      />
    </GridWrapper>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.genre"
      message="No genres found."
    />
  </LoadingData>
</template>
