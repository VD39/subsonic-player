export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      Accept: 'application/json',
    },
    onResponse({ response }) {
      const subsonicResponse = response._data['subsonic-response'];

      if (subsonicResponse?.status !== 'ok') {
        const code = subsonicResponse?.error?.code;
        const message =
          subsonicResponse?.error?.message || DEFAULT_ERROR_MESSAGE;
        throw new Error(code ? `[${code}] ${message}` : message);
      }

      if (subsonicResponse.status === 'ok') {
        response._data = {
          ...subsonicResponse,
        };

        return response._data;
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
