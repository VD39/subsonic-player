import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getPlaylistsMock } from '@/test/helpers';

import { useInfinityLoading } from './index';

const config = vi.hoisted(() => ({
  public: {
    LOAD_SIZE: 35,
  },
}));

mockNuxtImport('useRuntimeConfig', () => () => config);

const mockData = {
  playlist25: getPlaylistsMock(25),
  playlist50: getPlaylistsMock(50),
  playlist55: getPlaylistsMock(55),
};

const { fetchMoreData, hasMore, items, LOAD_SIZE, resetInfinityLoading } =
  useInfinityLoading('id');

describe('useInfinityLoading', () => {
  it('sets the default hasMore value', () => {
    expect(hasMore.value).toBe(true);
  });

  it('sets the default items value', () => {
    expect(items.value).toEqual([]);
  });

  it('sets the LOAD_SIZE value based on environment variable', () => {
    expect(LOAD_SIZE).toBe(35);
  });

  describe('when fetchMoreData function is called', () => {
    describe('when dataToFetch function returns no value', () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(null));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toBe(false);
      });

      it('does not update items value', () => {
        expect(items.value).toEqual([]);
      });
    });

    describe(`when dataToFetch function returns more than the ${LOAD_SIZE}`, () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(mockData.playlist55));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toBe(true);
      });

      it('sets the correct items value', () => {
        expect(items.value).toEqual(mockData.playlist55);
      });
    });

    describe(`when dataToFetch function returns the same as the ${LOAD_SIZE}`, () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(mockData.playlist50));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toBe(true);
      });

      it('sets the correct items value', () => {
        expect(items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
        ]);
      });
    });

    describe(`when dataToFetch function returns the less than the ${LOAD_SIZE}`, () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(mockData.playlist25));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toBe(false);
      });

      it('sets the correct items value', () => {
        expect(items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
          ...mockData.playlist25,
        ]);
      });
    });
  });

  describe('when resetInfinityLoading function is called', () => {
    beforeEach(() => {
      resetInfinityLoading();
    });

    it('clears the hasMore value', () => {
      expect(hasMore.value).toBe(true);
    });

    it('clears the items value', () => {
      expect(items.value).toEqual([]);
    });
  });
});
