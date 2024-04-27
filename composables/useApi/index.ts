import type { UseFetchOptions } from 'nuxt/app';

export function useAPI() {
  const authParams = useCookie('auth-params');
  const params = loadSession(authParams.value!);

  const baseURL = `${decodeURIComponent(params.server!)}/rest`;
  const baseQuery = {
    ...getAuthParams(params),
    ...getConfigParams(),
  };

  function getUrl(path: string, param: Record<string, string | number>) {
    const url = new URL(`${baseURL}/${path}`);
    url.search = convertToQueryString({
      ...baseQuery,
      ...param,
    });

    return url.toString();
  }

  function getImageUrl(id?: string, size = 500) {
    if (!id) {
      return `https://placehold.co/${size}x${size}`;
    }

    return getUrl('getCoverArt', {
      id,
      size,
    });
  }

  function getStreamUrl(id?: string) {
    if (!id) {
      return '';
    }

    return getUrl('stream', {
      id,
    });
  }

  /* istanbul ignore next -- @preserve */
  function fetchData<DataT>(
    url: string | (() => string),
    options: UseFetchOptions<SubsonicResponse, DataT> = {},
  ) {
    return useFetch(url, {
      ...options,
      query: {
        ...baseQuery,
        ...options.query,
      },
      baseURL: options.baseURL ?? baseURL,
      $fetch: useNuxtApp().$api,
    });
  }

  return {
    fetchData,
    getImageUrl,
    getStreamUrl,
  };
}
