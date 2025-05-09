import { COOKIE_MOCK } from '@/test/fixtures';

import { getAuthParams, getBaseOptions, loadSession } from './utils';

describe('getAuthParams', () => {
  describe('when params is an empty object', () => {
    it('returns correct value', () => {
      expect(getAuthParams({})).toEqual({
        s: undefined,
        t: undefined,
        u: undefined,
      });
    });
  });

  describe('when params has all values', () => {
    it('returns correct value', () => {
      expect(
        getAuthParams({
          param: 'param',
          param1: 'param1',
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
});

describe('loadSession', () => {
  describe('when token is not in a correct format', () => {
    it('returns correct value', () => {
      expect(loadSession('incorrect=value')).toEqual({
        salt: null,
        server: null,
        token: null,
        username: null,
      });
    });
  });

  describe('when token is in a correct format', () => {
    it('returns correct value', () => {
      expect(loadSession(COOKIE_MOCK)).toEqual({
        salt: 'salt',
        server: 'https://www.server.com',
        token: 'token',
        username: 'username',
      });
    });
  });
});

describe('getBaseOptions', () => {
  describe('when cookie is not in a correct format', () => {
    it('returns correct value', () => {
      expect(getBaseOptions('incorrect=value')).toEqual({
        baseParams: {
          c: 'web',
          f: 'json',
          s: null,
          t: null,
          u: null,
          v: '1.15.0',
        },
        baseURL: 'null/rest',
      });
    });
  });

  describe('when cookie is in a correct format', () => {
    it('returns correct value', () => {
      expect(getBaseOptions(COOKIE_MOCK)).toEqual({
        baseParams: {
          c: 'web',
          f: 'json',
          s: 'salt',
          t: 'token',
          u: 'username',
          v: '1.15.0',
        },
        baseURL: 'https://www.server.com/rest',
      });
    });
  });
});
