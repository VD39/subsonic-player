import type { UseFetchOptions } from 'nuxt/app';

import { defineEventHandler, getCookie, getQuery } from 'h3';
import { $fetch } from 'ofetch';

import { getBaseOptions } from '@/composables/useApi/utils';
import { COOKIE_NAMES } from '@/composables/useAuth/constant';

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

      const response = (await $fetch(url, {
        baseURL,
        query: {
          ...baseParams,
          ...options.query,
        },
      })) as { 'subsonic-response': SubsonicResponse };

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
