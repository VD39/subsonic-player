export function getAuthParams(params: Partial<User>) {
  switch (params.authMethod) {
    case 'apiKey':
      return {
        apiKey: params.apiKey,
      };
    case 'legacy':
      return {
        p: params.password,
        u: params.username,
      };
    default:
      return {
        s: params.salt,
        t: params.token,
        u: params.username,
      };
  }
}

export function getBaseOptions(cookie: string) {
  const params = loadSession(cookie);

  const baseURL = `${safeDecodeURIComponent(params.server!)}/rest`;
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
    v: '1.16.1',
  };
}

export function loadSession(token: string): User {
  const query = parseQueryString(token);

  return {
    apiKey: query.get('apiKey'),
    authMethod:
      AUTH_METHODS.find((method) => method === query.get('authMethod')) ||
      'token',
    password: query.get('password'),
    salt: query.get('salt'),
    server: query.get('server'),
    token: query.get('token'),
    username: query.get('username'),
  };
}
