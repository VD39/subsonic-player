<script setup lang="ts">
import ArtistList from '@/components/artist/ArtistList.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import SortControls from '@/components/ui/SortControls.vue';

const { getArtists } = useArtist();
const { viewLayout } = useSettings();

/* istanbul ignore next -- @preserve */
const { data: artistsData, status } = useAsyncData(
  ASYNC_DATA_KEYS.artists,
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

    <ArtistList :artists="sortedArtists" />
  </LoadingData>
</template>
