export function getAuthParams(params: Record<string, null | string>) {
  return {
    s: params.salt,
    t: params.token,
    u: params.username,
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

export function loadSession(token = '') {
  const query = parseQueryString(token);

  return {
    salt: query.get('salt'),
    server: query.get('server'),
    token: query.get('token'),
    username: query.get('username'),
  };
}
