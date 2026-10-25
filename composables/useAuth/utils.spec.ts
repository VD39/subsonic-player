import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { authDataMock } from '@/test/fixtures';

import { buildSessionParams } from './utils';

mockNuxtImport('generateRandomString', () => () => 'randomString');

describe('buildSessionParams', () => {
  describe('when authMethod is not set', () => {
    it('returns the correct response', () => {
      expect(buildSessionParams(authDataMock)).toEqual({
        authMethod: 'token',
        salt: 'randomString',
        server: 'server',
        token: 'MD5',
        username: 'username',
      });
    });
  });

  describe('when authMethod is token', () => {
    it('returns the correct response', () => {
      expect(
        buildSessionParams({
          ...authDataMock,
          authMethod: 'token',
        }),
      ).toEqual({
        authMethod: 'token',
        salt: 'randomString',
        server: 'server',
        token: 'MD5',
        username: 'username',
      });
    });
  });

  describe('when authMethod is legacy', () => {
    it('returns the correct response', () => {
      expect(
        buildSessionParams({
          ...authDataMock,
          authMethod: 'legacy',
        }),
      ).toEqual({
        authMethod: 'legacy',
        password: 'enc:70617373776f7264',
        server: 'server',
        username: 'username',
      });
    });

    describe('when password is not set', () => {
      it('returns the correct response', () => {
        expect(
          buildSessionParams({
            authMethod: 'legacy',
            server: 'server',
            username: 'username',
          }),
        ).toEqual({
          authMethod: 'legacy',
          password: 'enc:',
          server: 'server',
          username: 'username',
        });
      });
    });
  });

  describe('when authMethod is apiKey', () => {
    it('returns the correct response', () => {
      expect(
        buildSessionParams({
          ...authDataMock,
          apiKey: 'apiKey',
          authMethod: 'apiKey',
        }),
      ).toEqual({
        apiKey: 'apiKey',
        authMethod: 'apiKey',
        server: 'server',
      });
    });
  });
});
