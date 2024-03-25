import { generateRandomString } from './generateRandomString';

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
