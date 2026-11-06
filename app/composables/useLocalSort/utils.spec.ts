import { detectSortType, isDate, isNumeric } from './utils';

describe('isNumeric', () => {
  describe.each([
    [42, true],
    [Number.NaN, false],
    ['42', true],
    ['', false],
    ['  ', false],
    ['hello', false],
    [null, false],
    [true, false],
    [{}, false],
  ])('when the value is %o', (value: unknown, expected: boolean) => {
    it('returns the correct response', () => {
      expect(isNumeric(value)).toBe(expected);
    });
  });
});

describe('isDate', () => {
  describe.each([
    [new Date('2022-06-15'), true],
    [new Date('invalid'), false],
    ['2022-06-15', true],
    ['hello', false],
    [1655251200000, true],
    [null, false],
    [true, false],
    [{}, false],
  ])('when the value is %o', (value: unknown, expected: boolean) => {
    it('returns the correct response', () => {
      expect(isDate(value)).toBe(expected);
    });
  });
});

describe('detectSortType', () => {
  describe.each([
    [42, 'number'],
    ['42', 'number'],
    [new Date('2022-06-15'), 'date'],
    ['2022-06-15', 'date'],
    ['hello', 'string'],
    [null, 'string'],
    [true, 'string'],
  ])('when the value is %o', (value: unknown, expected: string) => {
    it('returns the correct response', () => {
      expect(detectSortType(value)).toBe(expected);
    });
  });
});
