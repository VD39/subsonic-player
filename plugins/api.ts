export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      Accept: 'application/json',
    },
    onResponse({ response }) {
      if (response._data instanceof Blob) {
        return response._data;
      }

      const subsonicResponse = response._data['subsonic-response'];

      if (subsonicResponse?.status !== 'ok') {
        throw new Error(
          subsonicResponse?.error?.message || DEFAULT_ERROR_MESSAGE,
        );
      }

      if (subsonicResponse.status === 'ok') {
        return (response._data = {
          ...subsonicResponse,
        });
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
