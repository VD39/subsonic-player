export function getAuthParams(params: Record<string, null | string>) {
  return {
    s: params.salt,
    t: params.token,
    u: params.username,
  };
}

export function getBaseOptions(cookie: string) {
  const params = loadSession(cookie);

  const baseURL = `${decodeURIComponent(params.server!)}/rest`;
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
