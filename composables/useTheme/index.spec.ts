import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useTheme } from './index';

const matchesMock = ref(false);

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn(() => ({
    matches: matchesMock.value,
  })),
  writable: true,
});

const setLocalStorageMock = vi.hoisted(() => vi.fn());
const getLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);
mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

const { isDarkTheme, setDefaultTheme, toggleTheme } = useTheme();

describe('useTheme', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default theme', () => {
    expect(isDarkTheme.value).toBe(false);
  });

  describe('when toggleTheme function is called', () => {
    describe.each([
      [true, 'true'],
      [false, 'false'],
    ])('when parameter is %s', (themeParam, stringify) => {
      beforeAll(() => {
        toggleTheme();
      });

      it('calls the localStorage.setItem with correct parameters', () => {
        expect(setLocalStorageMock).toBeCalledWith(
          STATE_NAMES.theme,
          stringify,
        );
      });

      it('sets the correct theme theme', () => {
        expect(isDarkTheme.value).toBe(themeParam);
      });
    });
  });

  describe('when setDefaultTheme function is called', () => {
    describe('when theme in local storage and system preference are not set', () => {
      beforeEach(() => {
        getLocalStorageMock.mockReturnValue(null);
        setDefaultTheme();
      });

      it('sets the correct theme theme', () => {
        expect(isDarkTheme.value).toBe(false);
      });
    });

    describe('when theme in local storage is not set and system preference is set', () => {
      beforeEach(() => {
        matchesMock.value = true;
        setDefaultTheme();
      });

      it('sets the correct theme theme', () => {
        expect(isDarkTheme.value).toBe(true);
      });
    });

    describe('when theme in local storage is set', () => {
      beforeEach(() => {
        getLocalStorageMock.mockReturnValue(true);
        setDefaultTheme();
      });

      it('sets the correct theme theme', () => {
        expect(isDarkTheme.value).toBe(true);
      });
    });
  });
});
