export function useViewLayout() {
  const viewLayout = useState<Layout>(STATE_NAMES.layout, () => 'gridLayout');

  function setViewLayout(selectedLayout: Layout = 'gridLayout') {
    viewLayout.value = selectedLayout;
    setLocalStorage(STATE_NAMES.layout, viewLayout.value);
  }

  return {
    setViewLayout,
    viewLayout,
  };
}
