export function useArtist() {
  const { fetchData } = useAPI();

  const artist = ref<Artist | null>(null);
  const artists = useState<Artist[]>(STATE_NAMES.artists, () => []);

  async function getArtists() {
    const { data: artistsData } = await fetchData('/getArtists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.artists.index || [])
          .flatMap((artist) => artist.artist!)
          .map(formatArtist),
    });

    if (Array.isArray(artistsData)) {
      artists.value = artistsData;
    }
  }

  async function getArtist(id: string) {
    const { data: artistInfoData } = await fetchData('/getArtistInfo2', {
      params: {
        id,
      },
    });

    const { data: artistData } = await fetchData('/getArtist', {
      params: {
        id,
      },
    });

    if (!artistInfoData && !artistData) {
      artist.value = null;
      return;
    }

    const mergedArtists = {
      ...artistInfoData?.artistInfo2,
      ...artistData?.artist,
    };

    artist.value = formatArtist(mergedArtists);
  }

  return {
    artist,
    artists,
    getArtist,
    getArtists,
  };
}
