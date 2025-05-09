import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useArtist } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { getArtists } = useArtist();

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
});
