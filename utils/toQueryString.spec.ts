import { toQueryString } from './toQueryString';

describe('toQueryString', () => {
  describe('when params is an empty object', () => {
    it('returns correct value', () => {
      expect(toQueryString({})).toBe('');
    });
  });

  describe('when params is not an empty object', () => {
    describe('when params has a key that is an empty string', () => {
      it('returns correct value', () => {
        expect(
          toQueryString({
            param: '',
          }),
        ).toBe('');
      });
    });

    describe('when params has a key that is a string', () => {
      it('returns correct value', () => {
        expect(
          toQueryString({
            param: 'Param',
          }),
        ).toBe('param=Param');
      });
    });

    describe('when params has a key that is an array', () => {
      it('returns correct value', () => {
        expect(
          toQueryString({
            param: ['Param', 'Param1'],
          }),
        ).toBe('param=Param&param=Param1');
      });
    });

    describe('when params has a multiple values', () => {
      it('returns correct value', () => {
        expect(
          toQueryString({
            param: 'Param',
            param1: ['Param', 'Param1'],
          }),
        ).toBe('param=Param&param1=Param&param1=Param1');
      });
    });
  });
});
