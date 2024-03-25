import { config } from '@/config';
import { toQueryString } from '@/utils';
import type { SubsonicResponse } from './types';

function getConfigParams() {
  return toQueryString({
    c: config.clientApplication,
    f: config.format,
    v: config.version,
  });
}

function getAuthParams(params: Record<string, string>) {
  return toQueryString({
    s: params.salt,
    t: params.hash,
    u: params.username,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUrl(path: string, params: Record<string, any>) {
  const { salt, hash, username, server, ...rest } = params;

  const authParams = getAuthParams({ salt, hash, username });
  const configParams = getConfigParams();

  return `${server}/rest/${path}?${authParams}&${configParams}&${toQueryString(rest)}`;
}

export function getCoverArtUrl(id?: string, size = 500) {
  if (!id) {
    return 'https://placehold.co/500x500';
  }

  const params = {
    id,
    size,
  };

  return getUrl('getCoverArt', params);
}

export function getStreamUrl(id: string) {
  if (!id) {
    return '';
  }

  const params = {
    id,
  };

  return getUrl('stream', params);
}

async function query(path: string, params = {}) {
  const url = getUrl(path, params);

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const subsonicResponse = response[
        'subsonic-response'
      ] as SubsonicResponse;

      if (!subsonicResponse || subsonicResponse.status !== 'ok') {
        throw new Error(
          subsonicResponse?.error?.message ||
            'Sorry, something went wrong. Please try again.',
        );
      }

      if (subsonicResponse.status === 'ok') {
        return subsonicResponse;
      }

      return {} as SubsonicResponse;
    });
}

export async function queryWithError(path: string, params = {}) {
  return query(path, params);
}

export async function queryWithResponse(path: string, params = {}) {
  // loading.setLoading(true);

  return query(path, params)
    .catch(() => {
      // snack.add({
      //   content: 'Sorry, something went wrong. Please try again.',
      //   type: 'error',
      //   auto: true,
      // });

      return {} as SubsonicResponse;
    })
    .finally(() => {
      // loading.setLoading(false);
    });
}
