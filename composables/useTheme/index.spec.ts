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

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const getLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

const { isDarkTheme, setDefaultTheme, toggleTheme } = useTheme();

describe('useTheme', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default isDarkTheme value', () => {
    expect(isDarkTheme.value).toBe(false);
  });

  describe('when toggleTheme function is called', () => {
    beforeAll(() => {
      toggleTheme();
    });

    it('calls the localStorage.setItem with correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.theme,
        'true',
      );
    });

    it('updates the isDarkTheme value with true', () => {
      expect(isDarkTheme.value).toBe(true);
    });

    describe('when toggleTheme function is called again', () => {
      beforeAll(() => {
        toggleTheme();
      });

      it('calls the localStorage.setItem with correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          STATE_NAMES.theme,
          'false',
        );
      });

      it('updates the isDarkTheme value with false', () => {
        expect(isDarkTheme.value).toBe(false);
      });
    });
  });

  describe('when setDefaultTheme function is called', () => {
    describe('when theme in local storage and system preference are not set', () => {
      beforeEach(() => {
        getLocalStorageMock.mockReturnValue(null);
        setDefaultTheme();
      });

      it('does not update the isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(false);
      });
    });

    describe('when theme in local storage is not set and system preference is set', () => {
      beforeEach(() => {
        matchesMock.value = true;
        setDefaultTheme();
      });

      it('sets the correct isDarkTheme value', () => {
        expect(isDarkTheme.value).toBe(true);
      });
    });

    describe('when theme in local storage is set', () => {
      describe.each([
        ['true', true],
        ['false', false],
      ])('when localStorage returns is %s', (localStorage, theme) => {
        beforeAll(() => {
          getLocalStorageMock.mockReturnValue(localStorage);
          setDefaultTheme();
        });

        it('sets the correct isDarkTheme value', () => {
          expect(isDarkTheme.value).toBe(theme);
        });
      });
    });
  });
});
