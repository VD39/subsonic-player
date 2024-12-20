import type { UseFetchOptions } from 'nuxt/app';

export function useAPI() {
  const config = useRuntimeConfig();
  const { IMAGE_SIZE } = config.public;

  const { addErrorSnack } = useSnack();

  const authCookie = useCookie(COOKIE_NAMES.auth);
  const params = loadSession(authCookie.value!);

  const baseURL = `${decodeURIComponent(params.server!)}/rest`;
  const baseParams = {
    ...getAuthParams(params),
    ...getConfigParams(),
  };

  function getUrl(path: string, param: Record<string, number | string>) {
    const url = new URL(`${baseURL}/${path}`);
    url.search = convertToQueryString({
      ...baseParams,
      ...param,
    });

    return url.toString();
  }

  function getImageUrl(image: string) {
    return getUrl('getCoverArt', {
      id: image,
      size: IMAGE_SIZE,
    });
  }

  function getStreamUrl(streamUrlId: string) {
    // If radio station.
    if (isUrl(streamUrlId)) {
      return streamUrlId;
    }

    return getUrl('stream', {
      id: streamUrlId,
    });
  }

  function getDownloadUrl(id: string) {
    return getUrl('download', {
      id,
    });
  }

  async function fetchData<DataT = SubsonicResponse>(
    url: (() => string) | string,
    options: UseFetchOptions<SubsonicResponse, DataT> = {},
  ) {
    const { data, error } = await useFetch(url, {
      ...options,
      $fetch: useNuxtApp().$api,
      baseURL: options.baseURL ?? baseURL,
      params: {
        ...baseParams,
        ...options.params,
      },
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
    getDownloadUrl,
    getImageUrl,
    getStreamUrl,
  };
}
