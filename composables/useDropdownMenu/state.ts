export function useDropdownMenuState() {
  const activeMenuId = useState<null | string>(
    STATE_NAMES.dropdownActiveMenuId,
    () => null,
  );

  const isAnyOpen = computed(() => activeMenuId.value !== null);

  return {
    isAnyOpen,
  };
}
