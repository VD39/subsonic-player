import {
  generateRandomString,
  replaceCharactersWithSpace,
  replaceSpacesWithCharacter,
  sanitiseString,
  splitCamelCase,
} from './strings';

describe('generateRandomString', () => {
  describe('when length is not defined', () => {
    it('returns correct value', () => {
      expect(generateRandomString().length).toBe(15);
    });
  });

  describe('when length is defined', () => {
    it('returns correct value', () => {
      expect(generateRandomString(20).length).toBe(20);
    });
  });
});

describe('replaceCharactersWithSpace', () => {
  describe.each([
    ['abcd', 'c', 'ab d'],
    ['abcd-efgh-ijkl', '-', 'abcd efgh ijkl'],
    ['abcd_efgh_ijkl', '_', 'abcd efgh ijkl'],
    ['abcd{efgh{ijkl', '{', 'abcd efgh ijkl'],
  ])(
    'when is string %s and replace characters is %s',
    (input, characters, output) => {
      it('returns correct value', () => {
        expect(replaceCharactersWithSpace(input, characters)).toBe(output);
      });
    },
  );
});

describe('replaceSpacesWithCharacter', () => {
  describe.each([
    ['ab d', 'c', 'abcd'],
    ['abcd efgh ijkl', '-', 'abcd-efgh-ijkl'],
    ['abcd efgh ijkl', '_', 'abcd_efgh_ijkl'],
    ['abcd efgh ijkl', '{', 'abcd{efgh{ijkl'],
  ])(
    'when is string %s and replace characters is %s',
    (input, characters, output) => {
      it('returns correct value', () => {
        expect(replaceSpacesWithCharacter(input, characters)).toBe(output);
      });
    },
  );
});

describe('sanitiseString', () => {
  describe.each([
    ['abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyz'],
    ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
    ['~!@#$%^&*(){}[]`/=?+|-_;:\'",<.>', ''],
    ['      abcdefghijklmnopqrstuvwxyz      ', 'abcdefghijklmnopqrstuvwxyz'],
  ])('when is string %s and replace characters is %s', (input, output) => {
    it('returns correct value', () => {
      expect(sanitiseString(input)).toBe(output);
    });
  });
});

describe('splitCamelCase', () => {
  describe.each([
    ['camelCase', 'camel Case'],
    ['kebab-case', 'kebab-case'],
    ['snake_case', 'snake_case'],
  ])('when is string %s', (input, output) => {
    it('returns correct value', () => {
      expect(splitCamelCase(input)).toBe(output);
    });
  });
});
