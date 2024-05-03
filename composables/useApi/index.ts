import type { UseFetchOptions } from 'nuxt/app';

export function useAPI() {
  const { addErrorSnack } = useSnack();

  const authParams = useCookie('auth-params');
  const params = loadSession(authParams.value!);

  const baseURL = `${decodeURIComponent(params.server!)}/rest`;
  const baseParams = {
    ...getAuthParams(params),
    ...getConfigParams(),
  };

  function getUrl(path: string, param: Record<string, string | number>) {
    const url = new URL(`${baseURL}/${path}`);
    url.search = convertToQueryString({
      ...baseParams,
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

  async function fetchData<DataT = SubsonicResponse>(
    url: string | (() => string),
    options: UseFetchOptions<SubsonicResponse, DataT> = {},
  ) {
    const { data, error } = await useFetch(url, {
      ...options,
      params: {
        ...baseParams,
        ...options.params,
      },
      baseURL: options.baseURL ?? baseURL,
      $fetch: useNuxtApp().$api,
    });

    if (error.value?.message || !data.value) {
      addErrorSnack(error.value?.message);
    }

    return {
      data: data.value,
      error: error.value,
    };
  }

  return {
    fetchData,
    getImageUrl,
    getStreamUrl,
  };
}
