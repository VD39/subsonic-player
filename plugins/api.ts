export default defineNuxtPlugin(() => {
  const authParams = useCookie('auth-params');
  const params = loadSession(authParams.value!);

  const api = $fetch.create({
    baseURL: `${decodeURIComponent(params.server!)}/rest`,
    headers: {
      Accept: 'application/json',
    },
    onRequest({ options }) {
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
    },
  });

  return {
    provide: {
      api,
    },
  };
});
