import { splitCamelCase } from './splitCamelCase';

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
