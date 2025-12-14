export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      Accept: 'application/json',
    },
    onResponse({
      response,
    }: {
      response: { _data?: Blob | Record<string, unknown> };
    }) {
      if (!response._data) {
        return;
      }

      if (response._data instanceof Blob) {
        return;
      }

      const subsonicResponse = (response._data as Record<string, unknown>)[
        'subsonic-response'
      ] as Record<string, unknown> | undefined;

      if (subsonicResponse?.status !== 'ok') {
        throw new Error(
          ((subsonicResponse?.error as Record<string, unknown>)
            ?.message as string) || DEFAULT_ERROR_MESSAGE,
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
