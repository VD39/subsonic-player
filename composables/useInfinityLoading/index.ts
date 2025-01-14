export function useInfinityLoading<T>() {
  const config = useRuntimeConfig();
  const { LOAD_SIZE } = config.public;

  const items = ref<T[]>([]);
  const offset = ref(0);
  const loading = ref(false);
  const hasMore = ref(true);

  async function fetchMoreData<T>(
    dataToFetch: (offset: number) => Promise<T> | T,
  ) {
    loading.value = true;

    const values = await dataToFetch(offset.value);

    if (!values || (Array.isArray(values) && !values.length)) {
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
    hasMore.value = true;
  }

  onBeforeUnmount(() => {
    resetToDefaults();
  });

  return {
    fetchMoreData,
    hasMore,
    items,
    LOAD_SIZE: Number(LOAD_SIZE),
    loading,
    resetToDefaults,
  };
}
