export function useArtist() {
  const { fetchData } = useAPI();

  const artist = ref<Artist | null>(null);
  const artists = useState<ArtistID3[]>('artists', () => []);

  async function getArtists() {
    const { data: artistsData } = await fetchData('/getArtists', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.artists.index || []).flatMap((artist) => artist.artist!),
    });

    if (Array.isArray(artistsData)) {
      artists.value = artistsData;
    }
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
