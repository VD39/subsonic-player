import MD5 from 'crypto-js/md5';

export function buildSessionParams(auth: AuthData) {
  const {
    apiKey,
    authMethod = 'token',
    password = '',
    server,
    username,
  } = auth;

  switch (authMethod) {
    case 'apiKey':
      return {
        apiKey,
        authMethod,
        server,
      };
    case 'legacy':
      return {
        authMethod,
        password: `enc:${toHex(password)}`,
        server,
        username,
      };
    default: {
      const salt = generateRandomString();

      return {
        authMethod,
        salt,
        server,
        token: MD5(`${password}${salt}`).toString(),
        username,
      };
    }
  }
}
