export function useInfinityLoading<T>() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const items = ref<T[]>([]);
  const offset = ref(0);
  const loading = useState('infinity-loader', () => false);
  const hasMore = useState('infinity-has-more', () => false);

  async function fetchMoreData(
    dataToFetch: (offset: number) => Promise<unknown>,
  ) {
    loading.value = true;

    const values = await dataToFetch(offset.value);

    if (!values) {
      hasMore.value = false;
    }

    if (Array.isArray(values)) {
      items.value.push(...values);
      offset.value = items.value.length;
      hasMore.value = values.length >= Number(LOAD_SIZE);
    }

    loading.value = false;
  }

  function resetToDefaults() {
    items.value = [];
    offset.value = 0;
    loading.value = false;
    hasMore.value = false;
  }

  onBeforeUnmount(() => {
    resetToDefaults();
  });

  return {
    fetchMoreData,
    hasMore,
    items,
    loading,
    resetToDefaults,
  };
}
