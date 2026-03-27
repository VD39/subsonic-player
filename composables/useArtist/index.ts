export function useArtist() {
  const { fetchData } = useAPI();

  async function getArtists() {
    const { data: artistsData } = await fetchData('/getArtists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.artists.index || [])
          .flatMap((index) => index.artist!)
          .map(formatArtist),
    });

    return artistsData || [];
  }

  function getArtist(id: string) {
    const route = useRoute();
    const config = useRuntimeConfig();

    if (config.public.SPA_MODE) {
      return useAsyncData(
        route.fullPath,
        () => fetchAndMergeArtistData(id, fetchData),
        {
          default: () => null,
          getCachedData: (key, nuxtApp) =>
            nuxtApp.payload.data[key] || nuxtApp.static.data[key],
        },
      );
    }

    return useFetch('/api/artist', {
      default: () => null,
      getCachedData: (key, nuxtApp) =>
        nuxtApp.payload.data[key] || nuxtApp.static.data[key],
      key: route.fullPath,
      query: {
        id,
      },
      transform: (response) => response.data,
    });
  }

  return {
    getArtist,
    getArtists,
  };
}
