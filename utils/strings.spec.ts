import {
  convertToTitleCase,
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
    ['ab-cd', undefined, 'ab cd'],
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
    ['ab cd', undefined, 'ab-cd'],
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

describe('convertToTitleCase', () => {
  describe.each([
    ['Title Case', 'Title Case'],
    ['all lowercase', 'All Lowercase'],
    ['ALL UPPERCASE', 'All Uppercase'],
    ['(Title) !Case', '(Title) !Case'],
    ['+all+ -lowercase', '+All+ -Lowercase'],
    ['!ALL /UPPERCASE/', '!All /Uppercase/'],
    ['^all 23lowercase44', '^All 23Lowercase44'],
    ['$ALL $$UPPERCASE', '$All $$Uppercase'],
  ])('when is string %s', (input, output) => {
    it('returns correct value', () => {
      expect(convertToTitleCase(input)).toBe(output);
    });
  });
});
