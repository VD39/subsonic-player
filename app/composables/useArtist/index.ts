export function useArtist() {
  const { fetchData } = useAPI();

  async function getArtists() {
    const { data: artistsData } = await fetchData('/getArtists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.artists.index || [])
          .flatMap((index) => index.artist || [])
          .map(formatArtist),
    });

    return artistsData || [];
  }

  async function getArtist(id: string) {
    const [
      { data: artistInfoData },
      { data: artistData },
      { data: similarSongsData },
    ] = await Promise.all([
      fetchData('/getArtistInfo2', {
        query: {
          id,
        },
      }),
      fetchData('/getArtist', {
        query: {
          id,
        },
      }),
      fetchData('/getSimilarSongs2', {
        query: {
          count: PREVIEW_TRACK_COUNT,
          id,
        },
      }),
    ]);

    if (!artistInfoData || !artistData) {
      return null;
    }

    return formatArtist({
      ...artistInfoData.artistInfo2,
      ...artistData.artist,
      similarSongs: similarSongsData?.similarSongs2?.song,
    });
  }

  async function getTopSongs(artist: string) {
    if (!artist) {
      return [];
    }

    const { data: topSongsData } = await fetchData('/getTopSongs', {
      query: {
        artist,
        count: PREVIEW_TRACK_COUNT,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.topSongs.song || []).map((track, index) =>
          formatTrack(track, index),
        ),
    });

    return topSongsData || [];
  }

  return {
    getArtist,
    getArtists,
    getTopSongs,
  };
}
