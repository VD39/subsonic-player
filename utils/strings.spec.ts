import {
  convertToTitleCase,
  formatListToString,
  generateRandomString,
  replaceCharactersWithSpace,
  replaceSpacesWithCharacter,
  sanitiseString,
  splitCamelCase,
} from './strings';

describe('generateRandomString', () => {
  describe('when length is not defined', () => {
    it('returns the correct response', () => {
      expect(generateRandomString().length).toBe(15);
    });
  });

  describe('when length is defined', () => {
    it('returns the correct response', () => {
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
      it('returns the correct response', () => {
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
      it('returns the correct response', () => {
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
    it('returns the correct response', () => {
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
    it('returns the correct response', () => {
      expect(splitCamelCase(input)).toBe(output);
    });
  });
});

describe('formatListToString', () => {
  describe('when list is empty', () => {
    it('returns the correct response', () => {
      expect(formatListToString([])).toBe('');
    });
  });

  describe('when list has one item', () => {
    it('returns the correct response', () => {
      expect(formatListToString(['Artist A'])).toBe('Artist A');
    });
  });

  describe('when list has two items', () => {
    it('returns the correct response', () => {
      expect(formatListToString(['Artist A', 'Artist B'])).toBe(
        'Artist A & Artist B',
      );
    });
  });

  describe('when list has three or more items', () => {
    it('returns the correct response', () => {
      expect(formatListToString(['Artist A', 'Artist B', 'Artist C'])).toBe(
        'Artist A, Artist B & Artist C',
      );
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
    it('returns the correct response', () => {
      expect(convertToTitleCase(input)).toBe(output);
    });
  });
});
