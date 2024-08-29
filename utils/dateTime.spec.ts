import { formatDate, secondsToHHMMSS } from './dateTime';

describe('formatDate', () => {
  describe.each([
    [new Date('2023-10-25T00:00:00Z'), '25 Oct 2023'],
    ['2023-10-25', '25 Oct 2023'],
    ['2023-10-25T15:30:00Z', '25 Oct 2023'],
  ])('when input is %s', (input, output) => {
    it('returns the correct date format', () => {
      expect(formatDate(input)).toBe(output);
    });
  });
});

describe('convertSecondsToHHMMSS', () => {
  describe.each([
    [1, '00:01'],
    [60, '01:00'],
    [600, '10:00'],
    [3690, '01:01:30'],
    ['1', '00:01'],
    ['60', '01:00'],
    ['600', '10:00'],
    ['3690', '01:01:30'],
    ['number', ''],
    [NaN, ''],
  ])('when seconds is %s', (seconds, output) => {
    it('returns the correct format', () => {
      expect(secondsToHHMMSS(seconds)).toBe(output);
    });
  });
});
