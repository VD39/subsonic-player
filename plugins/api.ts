export default defineNuxtPlugin(() => {
  const loading = useLoading();

  const api = $fetch.create({
    headers: {
      Accept: 'application/json',
    },
    onRequest({ options }) {
      if (!options.params?.noLoading) {
        loading.value = true;
      }
    },
    onResponse({ response }) {
      const subsonicResponse = response._data['subsonic-response'];

      if (!subsonicResponse || subsonicResponse.status !== 'ok') {
        loading.value = false;

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
