export function useSidebar() {
  const collapsed = useState(STATE_KEYS.sideBarCollapsed, () => false);
  const width = useState(STATE_KEYS.sideBarWidth, () => SIDEBAR_FULL_WIDTH);

  function toggle() {
    collapsed.value = !collapsed.value;
    width.value = collapsed.value
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_FULL_WIDTH;
  }

  return {
    collapsed,
    toggle,
    width,
  };
}
