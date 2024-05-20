import { getPlaylistsMock } from '@/test/helpers';
import { useInfinityLoading } from './index';
import { withSetup } from '~/test/withSetup';

const mockData = {
  playlist55: getPlaylistsMock(55),
  playlist50: getPlaylistsMock(50),
  playlist25: getPlaylistsMock(25),
};

const { fetchMoreData, hasMore, items, loading, resetToDefaults } =
  useInfinityLoading();

describe('useInfinityLoading', () => {
  it('sets the default hasMore value', () => {
    expect(hasMore.value).toEqual(false);
  });

  it('sets the default items value', () => {
    expect(items.value).toEqual([]);
  });

  it('sets the default loading value', () => {
    expect(loading.value).toEqual(false);
  });

  describe('when fetchMoreData function is called', () => {
    describe('when dataToFetch function returns no value', () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(null));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toEqual(false);
      });

      it('does not update items value', () => {
        expect(items.value).toEqual([]);
      });
    });

    describe('when dataToFetch function returns more than the LOAD_SIZE', () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(mockData.playlist55));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toEqual(true);
      });

      it('sets the correct items value', () => {
        expect(items.value).toEqual(mockData.playlist55);
      });
    });

    describe('when dataToFetch function returns the same as the LOAD_SIZE', () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(mockData.playlist50));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toEqual(true);
      });

      it('sets the correct items value', () => {
        expect(items.value).toEqual([
          ...mockData.playlist55,
          ...mockData.playlist50,
        ]);
      });
    });

    describe('when dataToFetch function returns the less than the LOAD_SIZE', () => {
      beforeAll(() => {
        fetchMoreData(() => Promise.resolve(mockData.playlist25));
      });

      it('sets the correct hasMore value', () => {
        expect(hasMore.value).toEqual(false);
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

  describe('when resetToDefaults function is called', () => {
    beforeEach(() => {
      resetToDefaults();
    });

    it('clears the hasMore value', () => {
      expect(hasMore.value).toEqual(false);
    });

    it('clears the items value', () => {
      expect(items.value).toEqual([]);
    });

    it('clears the loading value', () => {
      expect(loading.value).toEqual(false);
    });
  });

  describe('when the onBeforeUnmount is called', () => {
    beforeEach(() => {
      const result = withSetup(useInfinityLoading);
      result.composable.fetchMoreData(() =>
        Promise.resolve(mockData.playlist55),
      );

      result.app.unmount();
    });

    it('clears the hasMore value', () => {
      expect(hasMore.value).toEqual(false);
    });

    it('clears the items value', () => {
      expect(items.value).toEqual([]);
    });

    it('clears the loading value', () => {
      expect(loading.value).toEqual(false);
    });
  });
});
