<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import SortControls from '@/components/Molecules/SortControls.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';

const { getArtists } = useArtist();
const { viewLayout } = useViewLayout();

/* istanbul ignore next -- @preserve */
const { data: artistsData, status } = useAsyncData(
  ASYNC_DATA_NAMES.artists,
  async () => {
    const artists = await getArtists();

    return {
      artists,
    };
  },
  {
    default: () => ({
      artists: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const { sortedItems: sortedArtists, sortProps } = useLocalSort<Artist>({
  items: computed(() => artistsData.value.artists || []),
  options: [
    {
      defaultDirection: 'desc',
      key: 'totalAlbums',
      label: 'Total Albums',
    },
  ],
});

useHead({
  title: 'Artists',
});
</script>

<template>
  <h1>Artists</h1>

  <LoadingData :class="viewLayout" :status>
    <SortControls v-bind="sortProps" />

    <ArtistsList :artists="sortedArtists" />
  </LoadingData>
</template>
