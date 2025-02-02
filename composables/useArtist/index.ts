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

  async function getArtist(id: string) {
    const [{ data: artistInfoData }, { data: artistData }] = await Promise.all([
      fetchData('/getArtistInfo2', {
        params: {
          id,
        },
      }),
      fetchData('/getArtist', {
        params: {
          id,
        },
      }),
    ]);

    if (!artistInfoData && !artistData) {
      return null;
    }

    const mergedArtists = {
      ...artistInfoData?.artistInfo2,
      ...artistData?.artist,
    };

    return formatArtist(mergedArtists);
  }

  return {
    getArtist,
    getArtists,
  };
}
