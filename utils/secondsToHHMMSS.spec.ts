import { describe, expect, it } from 'vitest';
import { secondsToHHMMSS } from './secondsToHHMMSS';

describe('convertSecondsToHHMMSS', () => {
  describe.each([
    [1, '00:01'],
    [60, '01:00'],
    [600, '10:00'],
    [3690, '01:01:30'],
    [undefined, '-'],
  ])('when seconds is %s', (seconds: number | undefined, format: string) => {
    it('returns the correct format', () => {
      expect(secondsToHHMMSS(seconds)).toBe(format);
    });
  });
});
