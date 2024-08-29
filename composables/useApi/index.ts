import type { UseFetchOptions } from 'nuxt/app';

export function useAPI() {
  const config = useRuntimeConfig();
  const { IMAGE_SIZE } = config.public;

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

  function getImageUrl(image: string) {
    return getUrl('getCoverArt', {
      id: image,
      size: IMAGE_SIZE,
    });
  }

  function getStreamUrl(streamUrl: string) {
    if (isUrl(streamUrl)) {
      return streamUrl;
    }

    return getUrl('stream', {
      id: streamUrl,
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
