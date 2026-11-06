import { formatBytesToMB } from './formatBytesToMB';

describe('formatBytesToMB', () => {
  describe.each([
    [undefined, '0.0'],
    [0, '0.0'],
    [1048576, '1.0'],
    [5242880, '5.0'],
    [1572864, '1.5'],
  ])('when bytes is %s', (input, expected) => {
    it('returns the correct response', () => {
      expect(formatBytesToMB(input)).toBe(expected);
    });
  });
});
