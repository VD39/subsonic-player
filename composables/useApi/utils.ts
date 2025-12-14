export function getAuthParams(params: Record<string, null | string>) {
  return {
    s: params.salt,
    t: params.token,
    u: params.username,
  };
}

export function getBaseOptions(cookie: string) {
  const params = loadSession(cookie);

  // Handle case where server is null/undefined (can happen with file:// protocol on webOS)
  const serverUrl = params.server ? decodeURIComponent(params.server) : '';

  // Validate that we have a proper HTTP(S) URL
  if (
    !serverUrl ||
    (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://'))
  ) {
    console.warn('[useApi] Invalid or missing server URL:', serverUrl);
    return {
      baseParams: {
        ...getAuthParams(params),
        ...getConfigParams(),
      },
      baseURL: '',
    };
  }

  const baseURL = `${serverUrl}/rest`;
  const baseParams = {
    ...getAuthParams(params),
    ...getConfigParams(),
  };

  return {
    baseParams,
    baseURL,
  };
}

/* istanbul ignore next -- @preserve */
export function getConfigParams() {
  return {
    c: 'web',
    f: 'json',
    v: '1.15.0',
  };
}

export function loadSession(token: string) {
  const query = parseQueryString(token);

  return {
    salt: query.get('salt'),
    server: query.get('server'),
    token: query.get('token'),
    username: query.get('username'),
  };
}
