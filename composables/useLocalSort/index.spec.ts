import { getFormattedAlbumsMock } from '@/test/helpers';
import { withSetup } from '@/test/withSetup';

import { useLocalSort } from './index';

const albumsMock = [
  getFormattedAlbumsMock(1, {
    created: '2022-06-15',
    name: 'Banana',
    year: 2022,
  })[0],
  getFormattedAlbumsMock(1, {
    created: '2024-01-01',
    name: 'Apple',
    year: 2024,
  })[0],
  getFormattedAlbumsMock(1, {
    created: '2023-12-01',
    name: 'Cherry',
    year: 2023,
  })[0],
];

const sortOptionsMock: SortOption<Album>[] = [
  {
    defaultDirection: 'asc',
    key: 'year',
    label: 'Year',
  },
  {
    defaultDirection: 'desc',
    key: 'created',
    label: 'Date',
  },
];

describe('useLocalSort', () => {
  let result: ReturnType<
    typeof withSetup<ReturnType<typeof useLocalSort<Album>>>
  >;

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    result = withSetup(() =>
      useLocalSort<Album>({
        items: ref([...albumsMock]),
        options: sortOptionsMock,
      }),
    );
  });

  it('sets the default activeSort value', () => {
    expect(result.composable.sortProps.value.activeSort).toBe(
      SORT_NAME_OPTIONS.key,
    );
  });

  it('sets the default sortDirection value', () => {
    expect(result.composable.sortProps.value.sortDirection).toBe(
      SORT_NAME_OPTIONS.defaultDirection,
    );
  });

  it('sets the default options value', () => {
    expect(result.composable.sortProps.value.options).toEqual([
      SORT_NAME_OPTIONS,
      ...sortOptionsMock,
      SORT_RANDOM_OPTIONS,
    ]);
  });

  it('sets the default sortedItems value', () => {
    expect(result.composable.sortedItems.value).toEqual([
      albumsMock[1],
      albumsMock[0],
      albumsMock[2],
    ]);
  });

  describe('when items is an empty array', () => {
    beforeEach(() => {
      result = withSetup(() =>
        useLocalSort<Album>({
          items: ref([]),
        }),
      );
    });

    it('sets the correct sortedItems value', () => {
      expect(result.composable.sortedItems.value).toEqual([]);
    });
  });

  describe('when the toggleSort function is called', () => {
    describe('when the key matches the activeSort value', () => {
      beforeEach(() => {
        result.composable.sortProps.value.onToggleSort('name');
      });

      it('sets the correct sortDirection value', () => {
        expect(result.composable.sortProps.value.sortDirection).toBe('desc');
      });

      it('sets the correct sortedItems value', () => {
        expect(result.composable.sortedItems.value).toEqual([
          albumsMock[2],
          albumsMock[0],
          albumsMock[1],
        ]);
      });

      describe('when the toggleSort function is called again', () => {
        beforeEach(() => {
          result.composable.sortProps.value.onToggleSort('name');
        });

        it('sets the correct sortDirection value', () => {
          expect(result.composable.sortProps.value.sortDirection).toBe('asc');
        });
      });
    });

    describe('when the key is year', () => {
      beforeEach(() => {
        result.composable.sortProps.value.onToggleSort('year');
      });

      it('sets the correct sortedItems value', () => {
        expect(result.composable.sortedItems.value).toEqual([
          albumsMock[0],
          albumsMock[2],
          albumsMock[1],
        ]);
      });

      describe('when the toggleSort function is called again', () => {
        beforeEach(() => {
          result.composable.sortProps.value.onToggleSort('year');
        });

        it('sets the correct sortedItems value', () => {
          expect(result.composable.sortedItems.value).toEqual([
            albumsMock[1],
            albumsMock[2],
            albumsMock[0],
          ]);
        });
      });
    });

    describe('when the key does not match the activeSort value', () => {
      beforeEach(() => {
        result.composable.sortProps.value.onToggleSort('created');
      });

      it('sets the correct activeSort value', () => {
        expect(result.composable.sortProps.value.activeSort).toBe('created');
      });

      it('sets the correct sortDirection value', () => {
        expect(result.composable.sortProps.value.sortDirection).toBe('desc');
      });

      it('sets the correct sortedItems value', () => {
        expect(result.composable.sortedItems.value).toEqual([
          albumsMock[1],
          albumsMock[2],
          albumsMock[0],
        ]);
      });

      describe('when the toggleSort function is called again', () => {
        beforeEach(() => {
          result.composable.sortProps.value.onToggleSort('created');
        });

        it('sets the correct sortedItems value', () => {
          expect(result.composable.sortedItems.value).toEqual([
            albumsMock[0],
            albumsMock[2],
            albumsMock[1],
          ]);
        });
      });
    });

    describe('when the key does not match any option', () => {
      beforeEach(() => {
        result.composable.sortProps.value.onToggleSort('unknown');
      });

      it('sets the correct activeSort value', () => {
        expect(result.composable.sortProps.value.activeSort).toBe('unknown');
      });

      it('sets the correct sortDirection value', () => {
        expect(result.composable.sortProps.value.sortDirection).toBe('asc');
      });

      it('sets the correct sortedItems value', () => {
        expect(result.composable.sortedItems.value).toEqual([...albumsMock]);
      });
    });

    describe('when the key is random', () => {
      beforeEach(() => {
        result.composable.sortProps.value.onToggleSort('random');
      });

      it('sets the correct activeSort value', () => {
        expect(result.composable.sortProps.value.activeSort).toBe('random');
      });

      it('sets the correct sortDirection value', () => {
        expect(result.composable.sortProps.value.sortDirection).toBe('random');
      });

      it('sets the correct sortedItems value', () => {
        const sorted = result.composable.sortedItems.value;
        expect(sorted).toHaveLength(albumsMock.length);
        expect(sorted).toEqual(expect.arrayContaining(albumsMock));
      });

      it('sets the sortedItems value to a different order than the previous sort', () => {
        const nameSorted = [albumsMock[1], albumsMock[0], albumsMock[2]];
        const isSame = result.composable.sortedItems.value.every(
          (item, index) => item === nameSorted[index],
        );
        expect(isSame).toBe(false);
      });

      describe('when the toggleSort function is called again', () => {
        let previousSortedItems: Album[];

        beforeEach(() => {
          previousSortedItems = [...result.composable.sortedItems.value];
          result.composable.sortProps.value.onToggleSort('random');
        });

        it('sets the sortedItems value to a different order than the previous sort', () => {
          const isSame = result.composable.sortedItems.value.every(
            (item, index) => item === previousSortedItems[index],
          );
          expect(isSame).toBe(false);
        });
      });
    });
  });
});
