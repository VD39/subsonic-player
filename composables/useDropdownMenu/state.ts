export function useDropdownMenuState() {
  const activeMenuId = useState<null | string>(
    STATE_NAMES.dropdownActiveMenuId,
    () => null,
  );

  // Increments on every open, even when the same menu reopens, to ensure
  // watchers fire regardless of whether activeMenuId changed.
  const openEventCount = useState<number>(
    STATE_NAMES.dropdownOpenEventCount,
    () => 0,
  );

  const isAnyOpen = computed(() => activeMenuId.value !== null);

  function clearActiveMenuId() {
    activeMenuId.value = null;
    openEventCount.value = 0;
  }

  function setActiveMenuId(id: string) {
    activeMenuId.value = id;
    openEventCount.value++;
  }

  return {
    activeMenuId,
    clearActiveMenuId,
    isAnyOpen,
    openEventCount,
    setActiveMenuId,
  };
}
