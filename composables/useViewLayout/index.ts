export function useViewLayout() {
  const viewLayout = useState<Layout>(STATE_KEYS.layout, () => 'gridLayout');

  function setViewLayout(selectedLayout: Layout = 'gridLayout') {
    viewLayout.value = selectedLayout;
    setLocalStorage(LOCAL_STORAGE_KEYS.layout, viewLayout.value);
  }

  return {
    setViewLayout,
    viewLayout,
  };
}
