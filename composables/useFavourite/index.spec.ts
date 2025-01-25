import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useFavourite } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { getFavourites } = useFavourite();

describe('useFavourite', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getFavourites function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await getFavourites()).toEqual(DEFAULT_ALL_MEDIA);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            album: [
              {
                id: 'album',
              },
            ],
            artist: [
              {
                id: 'album',
              },
            ],
            song: [
              {
                id: 'album',
              },
            ],
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await getFavourites()).toEqual({
          album: [
            {
              id: 'album',
            },
          ],
          artist: [
            {
              id: 'album',
            },
          ],
          song: [
            {
              id: 'album',
            },
          ],
        });
      });
    });
  });
});
