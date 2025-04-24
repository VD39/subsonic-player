import { formatDate, secondsToHHMMSS, secondsToTimeFormat } from './dateTime';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: '2-digit',
};

describe('formatDate', () => {
  describe.each([
    [new Date('2023-10-25T00:00:00Z'), undefined, '25 October 2023'],
    ['2023-10-25', undefined, '25 October 2023'],
    ['2023-10-25T15:30:00Z', undefined, '25 October 2023'],
    [undefined, undefined, DEFAULT_VALUE],
    [new Date('2023-10-25T00:00:00Z'), DATE_OPTIONS, '25 Oct 23'],
    ['2023-10-25', DATE_OPTIONS, '25 Oct 23'],
    ['2023-10-25T15:30:00Z', DATE_OPTIONS, '25 Oct 23'],
    [undefined, DATE_OPTIONS, DEFAULT_VALUE],
  ])('when input is %s and options is %s', (input, options, output) => {
    it('returns the correct date format', () => {
      expect(formatDate(input, options)).toBe(output);
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
    ['number', '00:00'],
    [NaN, '00:00'],
    [undefined, '00:00'],
  ])('when input is %i seconds', (seconds, output) => {
    it('returns the correct format', () => {
      expect(secondsToHHMMSS(seconds)).toBe(output);
    });
  });
});

describe('secondsToTimeFormat', () => {
  describe.each([
    [0, '0s'],
    [59, '59s'],
    [60, '1m'],
    [61, '1m 1s'],
    [3600, '1h'],
    [3661, '1h 1m 1s'],
    [5433, '1h 30m 33s'],
    [7200, '2h'],
    [7321, '2h 2m 1s'],
    ['number', '0s'],
    [NaN, '0s'],
    [undefined, '0s'],
  ])('when input is %i seconds', (input, output) => {
    it('returns the correct format', () => {
      expect(secondsToTimeFormat(input)).toBe(output);
    });
  });
});
