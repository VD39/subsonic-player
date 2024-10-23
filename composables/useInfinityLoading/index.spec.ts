import { getPlaylistsMock } from '@/test/helpers';
import { withSetup } from '@/test/withSetup';

import { useInfinityLoading } from './index';

const mockData = {
  playlist25: getPlaylistsMock(25),
  playlist50: getPlaylistsMock(50),
  playlist55: getPlaylistsMock(55),
};

describe('useInfinityLoading', () => {
  let result: ReturnType<
    typeof withSetup<ReturnType<typeof useInfinityLoading>>
  >;

  beforeAll(() => {
    result = withSetup(useInfinityLoading);
  });

  it('sets the default hasMore value', () => {
    expect(result.composable.hasMore.value).toBe(false);
  });

  it('sets the default items value', () => {
    expect(result.composable.items.value).toEqual([]);
  });

  it('sets the default loading value', () => {
    expect(result.composable.loading.value).toBe(false);
  });

  it('sets the LOAD_SIZE value based on environment variable', () => {
    expect(result.composable.LOAD_SIZE).toBe(50);
  });

  describe('when fetchMoreData function is called', () => {
    describe('when dataToFetch function returns no value', () => {
      beforeAll(() => {
        result.composable.fetchMoreData(() => Promise.resolve(null));
      });

      it('sets the correct hasMore value', () => {
        expect(result.composable.hasMore.value).toBe(false);
      });

      it('does not update items value', () => {
        expect(result.composable.items.value).toEqual([]);
      });
    });

    describe('when dataToFetch function returns more than the LOAD_SIZE', () => {
      beforeAll(() => {
        result.composable.fetchMoreData(() =>
          Promise.resolve(mockData.playlist55),
        );
      });

      it('sets the correct hasMore value', () => {
        expect(result.composable.hasMore.value).toBe(true);
      });

      it('sets the correct items value', () => {
        expect(result.composable.items.value).toEqual(mockData.playlist55);
      });
    });

    describe('when dataToFetch function returns the same as the LOAD_SIZE', () => {
      beforeAll(() => {
        result.composable.fetchMoreData(() =>
          Promise.resolve(mockData.playlist50),
        );
      });

      it('sets the correct hasMore value', () => {
        expect(result.composable.hasMore.value).toBe(true);
      });

      it('sets the correct items value', () => {
        expect(result.composable.items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
        ]);
      });
    });

    describe('when dataToFetch function returns the less than the LOAD_SIZE', () => {
      beforeAll(() => {
        result.composable.fetchMoreData(() =>
          Promise.resolve(mockData.playlist25),
        );
      });

      it('sets the correct hasMore value', () => {
        expect(result.composable.hasMore.value).toBe(false);
      });

      it('sets the correct items value', () => {
        expect(result.composable.items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
          ...mockData.playlist25,
        ]);
      });
    });
  });

  describe('when resetToDefaults function is called', () => {
    beforeEach(() => {
      result.composable.resetToDefaults();
    });

    it('clears the hasMore value', () => {
      expect(result.composable.hasMore.value).toBe(false);
    });

    it('clears the items value', () => {
      expect(result.composable.items.value).toEqual([]);
    });

    it('clears the loading value', () => {
      expect(result.composable.loading.value).toBe(false);
    });
  });

  describe('when the onBeforeUnmount is called', () => {
    beforeEach(async () => {
      result = withSetup(useInfinityLoading);
      await result.composable.fetchMoreData(() =>
        Promise.resolve(mockData.playlist55),
      );

      result.app.unmount();
    });

    it('clears the hasMore value', () => {
      expect(result.composable.hasMore.value).toBe(false);
    });

    it('clears the items value', () => {
      expect(result.composable.items.value).toEqual([]);
    });

    it('clears the loading value', () => {
      expect(result.composable.loading.value).toBe(false);
    });
  });
});
