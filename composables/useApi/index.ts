import type { UseFetchOptions } from 'nuxt/app';

/* istanbul ignore next -- @preserve */
export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
}
