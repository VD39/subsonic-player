export default defineNuxtPlugin(() => {
  const authParams = useCookie('auth-params');
  const loading = useLoading();

  const params = loadSession(authParams.value!);

  const api = $fetch.create({
    baseURL: `${decodeURIComponent(params.server!)}/rest`,
    headers: {
      Accept: 'application/json',
    },
    onRequest({ options }) {
      loading.value = true;

      options.query = {
        ...getAuthParams(params),
        ...getConfigParams(),
        ...options.query,
      };
    },
    onResponse({ response }) {
      const subsonicResponse = response._data['subsonic-response'];

      if (!subsonicResponse || subsonicResponse.status !== 'ok') {
        throw new Error(
          subsonicResponse?.error?.message ||
            'Sorry, something went wrong. Please try again.',
        );
      }

      if (subsonicResponse.status === 'ok') {
        response._data = {
          ...subsonicResponse,
        };
      }

      loading.value = false;
    },
    onResponseError() {
      loading.value = false;
    },
    onRequestError() {
      loading.value = false;
    },
  });

  return {
    provide: {
      api,
    },
  };
});
