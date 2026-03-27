import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useArtist } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const config = vi.hoisted(() => ({
  public: {
    SPA_MODE: false,
  },
}));

mockNuxtImport('useRuntimeConfig', () => () => config);

mockNuxtImport('useAsyncData', () => vi.fn().mockReturnValue('useAsyncData'));

mockNuxtImport('useFetch', () => vi.fn().mockReturnValue('useFetch'));

const { getArtist, getArtists } = useArtist();

describe('useArtist', () => {
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
        expect(await getArtists()).toEqual([]);
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
        expect(await getArtists()).toEqual([
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
        config.public.SPA_MODE = true;
      });

      it('returns the useAsyncData response', () => {
        expect(getArtist('id')).toBe('useAsyncData');
      });
    });

    describe('when SPA_MODE is false', () => {
      beforeEach(() => {
        config.public.SPA_MODE = false;
      });

      it('returns the useFetch response', () => {
        expect(getArtist('id')).toBe('useFetch');
      });
    });
  });
});
