export function useInfinityLoading<T>(id: string) {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const items = useState<T[]>(`${STATE_NAMES.infinityItems}-${id}`, () => []);
  const offset = useState(`${STATE_NAMES.infinityOffset}-${id}`, () => 0);
  const hasMore = useState(`${STATE_NAMES.infinityHasMore}-${id}`, () => true);

  async function fetchMoreData<T>(
    dataToFetch: (offset: number) => Promise<T> | T,
  ) {
    const values = await dataToFetch(offset.value);

    if (!values || (Array.isArray(values) && !values.length)) {
      hasMore.value = false;
    }

    if (Array.isArray(values)) {
      items.value.push(...values);
      offset.value = items.value.length;
      hasMore.value = values.length >= Number(LOAD_SIZE);
    }

    return items.value;
  }

  function resetInfinityLoading() {
    items.value = [];
    offset.value = 0;
    hasMore.value = true;
  }

  return {
    fetchMoreData,
    hasMore,
    items,
    LOAD_SIZE: Number(LOAD_SIZE),
    resetInfinityLoading,
  };
}
