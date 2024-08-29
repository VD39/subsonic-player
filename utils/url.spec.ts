import { convertToQueryString, isUrl } from './url';

describe('convertToQueryString', () => {
  describe('when params is an empty object', () => {
    it('returns correct value', () => {
      expect(convertToQueryString({})).toBe('');
    });
  });

  describe('when params is not an empty object', () => {
    describe('when params has a key that is an empty string', () => {
      it('returns correct value', () => {
        expect(
          convertToQueryString({
            param: '',
          }),
        ).toBe('');
      });
    });

    describe('when params has a key that is a string', () => {
      it('returns correct value', () => {
        expect(
          convertToQueryString({
            param: 'Param',
            param1: 'Param 1',
          }),
        ).toBe('param=Param&param1=Param%25201');
      });
    });

    describe('when params has a key that is an array', () => {
      it('returns correct value', () => {
        expect(
          convertToQueryString({
            param: ['Param', 'Param1'],
          }),
        ).toBe('param=Param&param=Param1');
      });
    });

    describe('when params has a multiple values', () => {
      it('returns correct value', () => {
        expect(
          convertToQueryString({
            param: 'Param',
            param1: ['Param', 'Param 1'],
            param2: 'Param 12',
          }),
        ).toBe(
          'param=Param&param1=Param&param1=Param%25201&param2=Param%252012',
        );
      });
    });
  });
});

describe('isUrl', () => {
  describe.each([
    ['http://example.com', true],
    ['https://example.com', true],
    ['http://www.example.com', true],
    ['https://www.example.com', true],
    ['http://example.com/path/to/resource', true],
    ['https://example.com/path/to/resource', true],
    ['example.com', false],
    ['ftp://example.com', false],
    ['http:/example.com', false],
    ['https//example.com', false],
    ['http://', false],
    ['https://', false],
    ['just-a-string', false],
  ])('when input is %s', (url, output) => {
    it('return correct value', () => {
      expect(isUrl(url)).toBe(output);
    });
  });
});
