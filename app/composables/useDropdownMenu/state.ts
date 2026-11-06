export function useDropdownMenuState() {
  const activeMenuId = useState<null | string>(
    STATE_KEYS.dropdownActiveMenuId,
    () => null,
  );

  // Increments on every open, even when the same menu reopens, to ensure
  // watchers fire regardless of whether activeMenuId changed.
  const menuOpenRevision = useState<number>(
    STATE_KEYS.dropdownOpenEventCount,
    () => 0,
  );

  const isAnyOpen = computed(() => activeMenuId.value !== null);

  function clearActiveMenuId() {
    activeMenuId.value = null;
    menuOpenRevision.value = 0;
  }

  function setActiveMenuId(id: string) {
    activeMenuId.value = id;
    menuOpenRevision.value++;
  }

  return {
    activeMenuId,
    clearActiveMenuId,
    isAnyOpen,
    menuOpenRevision,
    setActiveMenuId,
  };
}
