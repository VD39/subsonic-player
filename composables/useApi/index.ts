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

  function getImageUrl(image: string, size = IMAGE_SIZE) {
    return getUrl('getCoverArt', {
      id: image,
      size,
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
    url: string,
    options: UseFetchOptions<SubsonicResponse, DataT> = {},
  ) {
    try {
      const { $api } = useNuxtApp();

      const response = await $api(url, {
        ...options,
        baseURL: options.baseURL ?? baseURL,
        params: {
          ...baseParams,
          ...options.params,
        },
      } as never);

      if (!response) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      let result = response as DataT;

      if (options.transform) {
        result = await options.transform(response as SubsonicResponse);
      }

      return {
        data: result,
        error: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error : new Error(error as string);

      addErrorSnack(errorMessage.message);

      return {
        data: null,
        error: errorMessage,
      };
    }
  }

  return {
    fetchData,
    getDownloadUrl,
    getImageUrl,
    getStreamUrl,
  };
}
