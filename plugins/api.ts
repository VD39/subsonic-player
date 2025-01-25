export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      Accept: 'application/json',
    },
    onResponse({ response }) {
      const subsonicResponse = response._data['subsonic-response'];

      if (!subsonicResponse || subsonicResponse.status !== 'ok') {
        throw new Error(
          subsonicResponse?.error?.message || DEFAULT_ERROR_MESSAGE,
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
