export interface AuthData {
  apiKey?: string;
  authMethod?: AuthMethod;
  password?: string;
  server: string;
  username?: string;
}

export type AuthMethod = (typeof AUTH_METHODS)[number];

export type LoginMode = (typeof LOGIN_MODE_OPTIONS)[number]['value'];
