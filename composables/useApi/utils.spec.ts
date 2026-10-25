import {
  apiKeyCookieMock,
  cookieMock,
  legacyCookieMock,
} from '@/test/fixtures';

import { getAuthParams, getBaseOptions, loadSession } from './utils';

describe('getAuthParams', () => {
  describe('when params is an empty object', () => {
    it('returns the correct response', () => {
      expect(getAuthParams({})).toEqual({
        s: undefined,
        t: undefined,
        u: undefined,
      });
    });
  });

  describe('when authMethod is not set', () => {
    it('returns the correct response', () => {
      expect(
        getAuthParams({
          salt: 'salt',
          token: 'token',
          username: 'username',
        }),
      ).toEqual({
        s: 'salt',
        t: 'token',
        u: 'username',
      });
    });
  });

  describe('when authMethod is token', () => {
    it('returns the correct response', () => {
      expect(
        getAuthParams({
          apiKey: 'apiKey',
          authMethod: 'token',
          password: 'password',
          salt: 'salt',
          token: 'token',
          username: 'username',
        }),
      ).toEqual({
        s: 'salt',
        t: 'token',
        u: 'username',
      });
    });
  });

  describe('when authMethod is legacy', () => {
    it('returns the correct response', () => {
      expect(
        getAuthParams({
          apiKey: 'apiKey',
          authMethod: 'legacy',
          password: 'password',
          salt: 'salt',
          token: 'token',
          username: 'username',
        }),
      ).toEqual({
        p: 'password',
        u: 'username',
      });
    });
  });

  describe('when authMethod is apiKey', () => {
    it('returns the correct response', () => {
      expect(
        getAuthParams({
          apiKey: 'apiKey',
          authMethod: 'apiKey',
          password: 'password',
          salt: 'salt',
          token: 'token',
          username: 'username',
        }),
      ).toEqual({
        apiKey: 'apiKey',
      });
    });
  });
});

describe('loadSession', () => {
  describe('when token is not in a correct format', () => {
    it('returns the correct response', () => {
      expect(loadSession('incorrect=value')).toEqual({
        apiKey: null,
        authMethod: 'token',
        password: null,
        salt: null,
        server: null,
        token: null,
        username: null,
      });
    });
  });

  describe('when authMethod is not set', () => {
    it('returns the correct response', () => {
      expect(loadSession(cookieMock)).toEqual({
        apiKey: null,
        authMethod: 'token',
        password: null,
        salt: 'salt',
        server: 'https://www.server.com',
        token: 'token',
        username: 'username',
      });
    });
  });

  describe('when authMethod is not a valid value', () => {
    it('returns the correct response', () => {
      expect(loadSession('authMethod=invalid')).toEqual({
        apiKey: null,
        authMethod: 'token',
        password: null,
        salt: null,
        server: null,
        token: null,
        username: null,
      });
    });
  });

  describe('when authMethod is legacy', () => {
    it('returns the correct response', () => {
      expect(loadSession(legacyCookieMock)).toEqual({
        apiKey: null,
        authMethod: 'legacy',
        password: 'enc:70617373776f7264',
        salt: null,
        server: 'https://www.server.com',
        token: null,
        username: 'username',
      });
    });
  });

  describe('when authMethod is apiKey', () => {
    it('returns the correct response', () => {
      expect(loadSession(apiKeyCookieMock)).toEqual({
        apiKey: 'apiKey',
        authMethod: 'apiKey',
        password: null,
        salt: null,
        server: 'https://www.server.com',
        token: null,
        username: 'username',
      });
    });
  });
});

describe('getBaseOptions', () => {
  describe('when cookie is not in a correct format', () => {
    it('returns the correct response', () => {
      expect(getBaseOptions('incorrect=value')).toEqual({
        baseParams: {
          c: 'web',
          f: 'json',
          s: null,
          t: null,
          u: null,
          v: '1.16.1',
        },
        baseURL: 'null/rest',
      });
    });
  });

  describe('when authMethod is not set', () => {
    it('returns the correct response', () => {
      expect(getBaseOptions(cookieMock)).toEqual({
        baseParams: {
          c: 'web',
          f: 'json',
          s: 'salt',
          t: 'token',
          u: 'username',
          v: '1.16.1',
        },
        baseURL: 'https://www.server.com/rest',
      });
    });
  });

  describe('when authMethod is legacy', () => {
    it('returns the correct response', () => {
      expect(getBaseOptions(legacyCookieMock)).toEqual({
        baseParams: {
          c: 'web',
          f: 'json',
          p: 'enc:70617373776f7264',
          u: 'username',
          v: '1.16.1',
        },
        baseURL: 'https://www.server.com/rest',
      });
    });
  });

  describe('when authMethod is apiKey', () => {
    it('returns the correct response', () => {
      expect(getBaseOptions(apiKeyCookieMock)).toEqual({
        baseParams: {
          apiKey: 'apiKey',
          c: 'web',
          f: 'json',
          v: '1.16.1',
        },
        baseURL: 'https://www.server.com/rest',
      });
    });
  });
});
