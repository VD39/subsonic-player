import type { UseFetchOptions } from 'nuxt/app';

export async function fetchAndMergeArtistData(
  id: string,
  fetchFn: <DataT = SubsonicResponse>(
    url: string,
    options: UseFetchOptions<SubsonicResponse, DataT>,
  ) => Promise<{
    data: DataT | null;
    error?: Error | null;
  }>,
) {
  const { data: artistInfo } = await fetchFn('/getArtistInfo2', {
    query: {
      id,
    },
  });

  const { data: artistData } = await fetchFn('/getArtist', {
    query: {
      id,
    },
  });

  if (!artistInfo || !artistData) {
    return null;
  }

  const { data: similarSongs } = await fetchFn('/getSimilarSongs2', {
    query: {
      count: PREVIEW_TRACK_COUNT,
      id,
    },
  });

  const { data: topSongs } = await fetchFn('/getTopSongs', {
    query: {
      artist: artistData.artist?.name || '',
      count: PREVIEW_TRACK_COUNT,
    },
  });

  const mergedArtists = {
    ...artistInfo.artistInfo2,
    ...artistData.artist,
    similarSongs: similarSongs?.similarSongs2?.song,
    topSongs: topSongs?.topSongs?.song,
  };

  return formatArtist(mergedArtists);
}
