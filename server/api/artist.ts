import type { UseFetchOptions } from 'nuxt/app';

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  async function fetchData<DataT = SubsonicResponse>(
    url: string,
    options: UseFetchOptions<SubsonicResponse, DataT>,
  ) {
    try {
      const authCookie = getCookie(event, COOKIE_NAMES.auth);

      if (!authCookie) {
        throw new Error(`No ${COOKIE_NAMES.auth} cookie found.`);
      }

      const { baseParams, baseURL } = getBaseOptions(authCookie);

      const response = await $fetch<{
        'subsonic-response': SubsonicResponse;
      }>(url, {
        baseURL,
        query: {
          ...baseParams,
          ...options.query,
        },
      });

      const subsonicResponse = response['subsonic-response'];

      if (subsonicResponse?.status !== 'ok') {
        throw new Error('No response from server.');
      }

      if (subsonicResponse.status === 'ok') {
        return {
          data: subsonicResponse as DataT,
        };
      }

      return {
        data: null,
      };
    } catch {
      return {
        data: null,
      };
    }
  }

  const result = await fetchAndMergeArtistData(id as string, fetchData);

  return {
    data: result,
  };
});
