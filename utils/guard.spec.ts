import {
  safeDecodeURIComponent,
  safeJsonParse,
  safeJsonStringify,
} from './guard';

describe('safeDecodeURIComponent', () => {
  describe.each([
    ['hello%20world', 'hello world'],
    ['a%2Bb', 'a+b'],
    ['%C3%A9', 'é'],
    ['plain', 'plain'],
    ['', ''],
    // Malformed percent-encoding to tests catch block.
    ['%GG', '%GG'],
    ['%', '%'],
  ])('when the value is %s', (input, expected) => {
    it('returns the correct response', () => {
      expect(safeDecodeURIComponent(input)).toBe(expected);
    });
  });
});

describe('safeJsonParse', () => {
  describe.each([
    [
      '{"key":"value"}',
      {
        key: 'value',
      },
    ],
    ['[1,2,3]', [1, 2, 3]],
    ['42', 42],
    ['"hello"', 'hello'],
    ['null', null],
    ['true', true],
    // Invalid JSON to tests catch block.
    ['{//}', 'FALLBACK'],
    ['not-json', 'FALLBACK'],
    ['', 'FALLBACK'],
  ])('when the value is %o', (input, expected) => {
    it('returns the correct response', () => {
      expect(safeJsonParse(input, 'FALLBACK')).toEqual(expected);
    });
  });
});

describe('safeStringify', () => {
  describe.each([
    [{ key: 'value' }, '{"key":"value"}'],
    [[1, 2, 3], '[1,2,3]'],
    [42, '42'],
    ['hello', '"hello"'],
    [null, 'null'],
    [true, 'true'],
    // Invalid values to tests catch block.
    [100n, null],
    [
      {
        toJSON() {
          throw new Error('Failed');
        },
      },
      null,
    ],
  ])('when the value is %o', (input, expected) => {
    it('returns the correct response', () => {
      expect(safeJsonStringify(input)).toEqual(expected);
    });
  });
});
