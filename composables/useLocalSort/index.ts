export function useLocalSort<T>(
  sortOptions: UseLocalSortOptions<T>,
): UseLocalSortReturn<T> {
  const { items, options: extraOptions = [] } = sortOptions;

  const options = [SORT_NAME_OPTIONS, ...extraOptions, SORT_RANDOM_OPTIONS];

  const defaultOption = options[0];
  const activeSort = ref(defaultOption.key);
  const sortDirection = ref<SortDirection>(defaultOption.defaultDirection);
  const randomSeed = ref(0);
  const randomShuffledItems = ref<T[]>([]) as Ref<T[]>;

  function selectSort(key: string) {
    if (key === 'random') {
      activeSort.value = key;
      sortDirection.value = 'random';
      randomSeed.value++;

      const source = randomShuffledItems.value.length
        ? randomShuffledItems.value
        : items.value;
      randomShuffledItems.value = shuffleArray([...source]);

      return;
    }

    const sortOption = options.find((option) => option.key === key);

    activeSort.value = key;
    sortDirection.value = sortOption?.defaultDirection || 'asc';
  }

  function toggleDirection() {
    if (activeSort.value === 'random') {
      selectSort('random');
      return;
    }

    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  }

  const sortedItems = computed(() => {
    const sortOptionKey = options.find(
      (option) => option.key === activeSort.value,
    )?.key as keyof T;

    if (!sortOptionKey || !items.value.length) {
      return items.value;
    }

    // Added to force re-computation for random sort when toggled.
    const _forceUpdate = randomSeed.value;

    if (activeSort.value === 'random') {
      return randomShuffledItems.value;
    }

    const sampleValue = items.value[0][sortOptionKey];

    const sortType = detectSortType(sampleValue);

    return [...items.value].sort((a, b) => {
      const valA = a[sortOptionKey];
      const valB = b[sortOptionKey];

      let comparison = 0;

      switch (sortType) {
        case 'date':
          comparison =
            new Date(String(valA)).getTime() - new Date(String(valB)).getTime();
          break;
        case 'number':
          comparison = Number(valA) - Number(valB);
          break;
        case 'string':
          comparison = String(valA).localeCompare(String(valB));
          break;
      }

      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  });

  const sortProps = computed<SortButtonsProps>(() => ({
    activeSort: activeSort.value,
    onSelectSort: selectSort,
    onToggleDirection: toggleDirection,
    options,
    sortDirection: sortDirection.value,
  }));

  return {
    sortedItems,
    sortProps,
  };
}
