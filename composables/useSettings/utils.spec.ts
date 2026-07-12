import { settingsMock } from '@/test/fixtures';

import {
  isValidSettings,
  resolveDarkTheme,
  toBitrate,
  toLayout,
  toTheme,
} from './utils';

const matchesMock = ref(false);

Object.defineProperty(globalThis, 'matchMedia', {
  value: vi.fn(() => ({
    matches: matchesMock.value,
  })),
  writable: true,
});

describe('loadThemePreference', () => {
  describe.each([
    ['dark', true],
    ['true', true],
    [true, true],
    ['light', false],
    ['false', false],
    [false, false],
  ])('when the theme is %o', (theme, expected) => {
    it('returns the correct response', () => {
      expect(resolveDarkTheme(theme)).toBe(expected);
    });
  });

  describe('when the system preference is not dark', () => {
    it('returns the correct response', () => {
      expect(resolveDarkTheme()).toBe(false);
    });
  });

  describe('when the system preference is dark', () => {
    beforeEach(() => {
      matchesMock.value = true;
    });

    it('returns the correct response', () => {
      expect(resolveDarkTheme()).toBe(true);
    });
  });
});

describe('toBitrate', () => {
  describe.each([
    [0, 0],
    [320, 320],
    [256, 256],
    [192, 192],
    [128, 128],
    [999, 0],
    ['320', 320],
    [999, 0],
    ['999', 0],
    ['invalid', 0],
    [undefined, 0],
    [null, 0],
  ])('when the value is %o', (value, expected) => {
    it('returns the correct response', () => {
      expect(toBitrate(value as Bitrate)).toBe(expected);
    });
  });
});

describe('toLayout', () => {
  describe.each([
    ['gridLayout', 'gridLayout'],
    ['listLayout', 'listLayout'],
    ['invalid', 'gridLayout'],
    [undefined, 'gridLayout'],
    [null, 'gridLayout'],
  ])('when the value is %o', (value, expected) => {
    it('returns the correct response', () => {
      expect(toLayout(value as Layout)).toBe(expected);
    });
  });
});

describe('toTheme', () => {
  describe.each([
    ['dark', 'dark'],
    ['light', 'light'],
    ['auto', 'auto'],
    ['invalid', 'auto'],
    [undefined, 'auto'],
    [null, 'auto'],
  ])('when the value is %o', (value, expected) => {
    it('returns the correct response', () => {
      expect(toTheme(value as Theme)).toBe(expected);
    });
  });
});

describe('isValidSettings', () => {
  describe.each([
    [settingsMock, true],
    [null, false],
    ['string', false],
    [[], false],
    [
      {
        ...settingsMock,
        layout: 'invalidLayout',
      },
      false,
    ],
    [
      {
        ...settingsMock,
        streamBitrate: 999,
      },
      false,
    ],
    [
      {
        ...settingsMock,
        theme: 'invalidTheme',
      },
      false,
    ],
    [
      {
        ...settingsMock,
        deletePodcastOnEnd: 'true',
      },
      false,
    ],
    [
      {
        ...settingsMock,
        scrobbleEnabled: 1,
      },
      false,
    ],
    [
      {
        ...settingsMock,
        showPodcasts: 'true',
      },
      false,
    ],
    [
      {
        ...settingsMock,
        showRadioStations: 0,
      },
      false,
    ],
    [
      {
        ...settingsMock,
        replayGainMode: 'invalidMode',
      },
      false,
    ],
  ])('when the value is %o', (data, expected) => {
    it('returns the correct response', () => {
      expect(isValidSettings(data as unknown as SettingsData)).toBe(expected);
    });
  });
});
