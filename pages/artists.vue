<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';

const { getArtists } = useArtist();

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

useHead({
  title: 'Artists',
});
</script>

<template>
  <h1>Artists</h1>

  <LoadingData :status>
    <ArtistsList :artists="artistsData.artists" />
  </LoadingData>
</template>
