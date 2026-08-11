import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useArtist } from './index';

const { configMock } = vi.hoisted(() => ({
  configMock: {
    public: {
      LOAD_SIZE: 35,
      SPA_MODE: false,
    },
  },
}));

mockNuxtImport('useRuntimeConfig', (original) => () => ({
  ...original(),
  ...configMock,
}));

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

mockNuxtImport('useAsyncData', () => vi.fn().mockReturnValue('useAsyncData'));

mockNuxtImport('useFetch', () => vi.fn().mockReturnValue('useFetch'));

describe('useArtist', () => {
  let composable: ReturnType<typeof useArtist>;

  beforeAll(() => {
    composable = useArtist();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getArtists function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtists()).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name',
            },
          ],
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.getArtists()).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the getArtist function is called', () => {
    describe('when SPA_MODE is true', () => {
      beforeEach(() => {
        configMock.public.SPA_MODE = true;
      });

      it('returns the useAsyncData response', () => {
        expect(composable.getArtist('id')).toBe('useAsyncData');
      });
    });

    describe('when SPA_MODE is false', () => {
      beforeEach(() => {
        configMock.public.SPA_MODE = false;
      });

      it('returns the useFetch response', () => {
        expect(composable.getArtist('id')).toBe('useFetch');
      });
    });
  });
});
