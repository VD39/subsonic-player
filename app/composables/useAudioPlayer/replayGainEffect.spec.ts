import { calculateReplayGain } from './replayGainEffect';

describe('calculateReplayGain', () => {
  describe('when mode is "off"', () => {
    describe.each([
      ['off', 6, 12, 0.5, 1],
      ['off', undefined, undefined, undefined, 1],
    ])('when the value is %o', (mode, trackGain, albumGain, peak, expected) => {
      it('returns the correct response', () => {
        const result = calculateReplayGain(
          mode as ReplayGainMode,
          trackGain,
          albumGain,
          peak,
        );

        expect(result).toBeCloseTo(expected, 5);
      });
    });
  });

  describe('when converting dB to linear gain', () => {
    describe.each([
      ['track', 0, -3, undefined, 1],
      ['album', -3, 0, undefined, 1],
      ['track', 6, -3, undefined, Math.pow(10, 6 / 20)],
      ['album', -6, 6, undefined, Math.pow(10, 6 / 20)],
    ])('when the value is %o', (mode, trackGain, albumGain, peak, expected) => {
      it('returns the correct response', () => {
        const result = calculateReplayGain(
          mode as ReplayGainMode,
          trackGain,
          albumGain,
          peak,
        );

        expect(result).toBeCloseTo(expected, 5);
      });
    });
  });

  describe('when gain parameters are missing', () => {
    describe.each([
      ['track', undefined, 5, undefined, 1],
      ['album', 5, undefined, undefined, 1],
    ])('when the value is %o', (mode, trackGain, albumGain, peak, expected) => {
      it('returns the correct response', () => {
        const result = calculateReplayGain(
          mode as ReplayGainMode,
          trackGain,
          albumGain,
          peak,
        );

        expect(result).toBeCloseTo(expected, 5);
      });
    });
  });

  describe('when peak enforces a cap', () => {
    describe.each([
      ['track', 6, 0, 0.8, 1.25],
      ['track', 6, 0, 0.2, Math.pow(10, 6 / 20)],
    ])('when the value is %o', (mode, trackGain, albumGain, peak, expected) => {
      it('returns the correct response', () => {
        const result = calculateReplayGain(
          mode as ReplayGainMode,
          trackGain,
          albumGain,
          peak,
        );

        expect(result).toBeCloseTo(expected, 5);
      });
    });
  });

  describe('when peak is missing or invalid', () => {
    describe.each([
      ['track', 6, 0, 0, Math.pow(10, 6 / 20)],
      ['track', 6, 0, -0.5, Math.pow(10, 6 / 20)],
      ['track', undefined, undefined, undefined, 1],
      ['album', undefined, undefined, 0, 1],
      ['track', undefined, undefined, -1, 1],
      ['track', Infinity, undefined, undefined, Infinity],
    ])('when the value is %o', (mode, trackGain, albumGain, peak, expected) => {
      it('returns the correct response', () => {
        const result = calculateReplayGain(
          mode as ReplayGainMode,
          trackGain,
          albumGain,
          peak,
        );

        if (expected === Infinity) {
          expect(result).toBe(Infinity);
        } else {
          expect(result).toBeCloseTo(expected, 5);
        }
      });
    });
  });
});
