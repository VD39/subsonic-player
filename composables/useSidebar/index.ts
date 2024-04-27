const SIDEBAR_FULL_WIDTH = '16rem';
const SIDEBAR_COLLAPSED_WIDTH = '5rem';

export function useSidebar() {
  const collapsed = useState('collapsed', () => false);
  const width = useState('width', () => SIDEBAR_FULL_WIDTH);

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
