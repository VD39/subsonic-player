import { getAuthParams, loadSession } from './utils';

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
  describe('when token is an undefined', () => {
    it('returns correct value', () => {
      expect(loadSession()).toEqual({
        salt: null,
        server: null,
        token: null,
        username: null,
      });
    });
  });

  describe('when token is defined', () => {
    it('returns correct value', () => {
      expect(
        loadSession('token=token&salt=salt&server=server&username=username'),
      ).toEqual({
        salt: 'salt',
        server: 'server',
        token: 'token',
        username: 'username',
      });
    });
  });
});
