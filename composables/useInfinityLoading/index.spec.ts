import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getPlaylistsMock } from '@/test/helpers';

import { useInfinityLoading } from './index';

const { configMock } = vi.hoisted(() => ({
  configMock: {
    public: {
      LOAD_SIZE: 35,
    },
  },
}));

mockNuxtImport('useRuntimeConfig', (original) => () => ({
  ...original(),
  ...configMock,
}));

const mockData = {
  playlist25: getPlaylistsMock(25),
  playlist50: getPlaylistsMock(50),
  playlist55: getPlaylistsMock(55),
};

describe('useInfinityLoading', () => {
  let composable: ReturnType<typeof useInfinityLoading>;

  beforeAll(() => {
    composable = useInfinityLoading('id');
  });

  it('sets the default hasMore value', () => {
    expect(composable.hasMore.value).toBe(true);
  });

  it('sets the default items value', () => {
    expect(composable.items.value).toEqual([]);
  });

  it('sets the LOAD_SIZE value based on environment variable', () => {
    expect(composable.LOAD_SIZE).toBe(35);
  });

  describe('when fetchMoreData function is called', () => {
    describe('when fetchFn function returns no value', () => {
      beforeAll(() => {
        composable.fetchMoreData(() => Promise.resolve(null));
      });

      it('sets the correct hasMore value', () => {
        expect(composable.hasMore.value).toBe(false);
      });

      it('does not update items value', () => {
        expect(composable.items.value).toEqual([]);
      });
    });

    describe(`when fetchFn function returns more than the ${configMock.public.LOAD_SIZE}`, () => {
      beforeAll(() => {
        composable.fetchMoreData(() => Promise.resolve(mockData.playlist55));
      });

      it('sets the correct hasMore value', () => {
        expect(composable.hasMore.value).toBe(true);
      });

      it('sets the correct items value', () => {
        expect(composable.items.value).toEqual(mockData.playlist55);
      });
    });

    describe(`when fetchFn function returns the same as the ${configMock.public.LOAD_SIZE}`, () => {
      beforeAll(() => {
        composable.fetchMoreData(() => Promise.resolve(mockData.playlist50));
      });

      it('sets the correct hasMore value', () => {
        expect(composable.hasMore.value).toBe(true);
      });

      it('sets the correct items value', () => {
        expect(composable.items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
        ]);
      });
    });

    describe(`when fetchFn function returns the less than the ${configMock.public.LOAD_SIZE}`, () => {
      beforeAll(() => {
        composable.fetchMoreData(() => Promise.resolve(mockData.playlist25));
      });

      it('sets the correct hasMore value', () => {
        expect(composable.hasMore.value).toBe(false);
      });

      it('sets the correct items value', () => {
        expect(composable.items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
          ...mockData.playlist25,
        ]);
      });
    });
  });

  describe('when resetInfinityLoading function is called', () => {
    beforeEach(() => {
      composable.resetInfinityLoading();
    });

    it('clears the hasMore value', () => {
      expect(composable.hasMore.value).toBe(true);
    });

    it('clears the items value', () => {
      expect(composable.items.value).toEqual([]);
    });
  });
});
