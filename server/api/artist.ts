import type { UseFetchOptions } from '#app';

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  async function fetchData<DataT = SubsonicResponse>(
    url: string,
    options: UseFetchOptions<SubsonicResponse, DataT>,
  ) {
    try {
      const authCookie = getCookie(event, COOKIE_NAMES.auth);

      if (!authCookie) {
        throw new Error();
      }

      const { baseParams, baseURL } = getBaseOptions(authCookie);

      const response = await $fetch<{
        'subsonic-response': SubsonicResponse;
      }>(url, {
        baseURL,
        params: {
          ...baseParams,
          ...options.params,
        },
      });

      const subsonicResponse = response['subsonic-response'];

      if (!subsonicResponse || subsonicResponse.status !== 'ok') {
        throw new Error();
      }

      if (subsonicResponse.status === 'ok') {
        return subsonicResponse;
      }
    } catch {
      return null;
    }
  }

  const artistInfoResponse = await fetchData('/getArtistInfo2', {
    params: {
      id,
    },
  });

  const artistResponse = await fetchData('/getArtist', {
    params: {
      id,
    },
  });

  if (!artistInfoResponse || !artistResponse) {
    return {
      data: null,
    };
  }

  const similarSongsResponse = await fetchData('/getSimilarSongs2', {
    params: {
      count: PREVIEW_TRACK_COUNT,
      id,
    },
  });

  const topSongsResponse = await fetchData('/getTopSongs', {
    params: {
      artist: artistResponse.artist.name,
      count: PREVIEW_TRACK_COUNT,
    },
  });

  const mergedArtists = {
    ...artistInfoResponse.artistInfo2,
    ...artistResponse.artist,
    similarSongs: similarSongsResponse?.similarSongs2?.song,
    topSongs: topSongsResponse?.topSongs?.song,
  };

  return {
    data: formatArtist(mergedArtists),
  };
});
