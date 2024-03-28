/* istanbul ignore next -- @preserve */
export function getConfigParams() {
  return {
    c: 'web',
    f: 'json',
    v: '1.15.0',
  };
}

export function getAuthParams(params: Record<string, string | null>) {
  return {
    s: params.salt,
    t: params.token,
    u: params.username,
  };
}

export function loadSession(token = '') {
  const query = parseQueryString(token);

  return {
    token: query.get('token'),
    salt: query.get('salt'),
    server: query.get('server'),
    username: query.get('username'),
  };
}
