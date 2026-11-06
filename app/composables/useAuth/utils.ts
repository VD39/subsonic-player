import { md5 } from 'js-md5';

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
        token: md5(`${password}${salt}`),
        username,
      };
    }
  }
}
