let activeCleanup: (() => void) | null = null;

export function useDropdownMenu(options: DropdownOptions) {
  const { dropdownListRef, dropdownMenuRef } = options;

  const { lockScroll, unlockScroll } = useScrollLock('dropdown', [
    'disableAllPointerEvents',
  ]);

  const activeMenuId = useState<null | string>(
    STATE_NAMES.dropdownActiveMenuId,
    () => null,
  );

  const menuId = crypto.randomUUID();

  const abortController = ref<AbortController | null>(null);
  const menuStyle = ref<Record<string, string>>({});

  const isOpen = computed(() => activeMenuId.value === menuId);

  function positionDropdownMenu(
    dropdownPosition: ReturnType<typeof getPointerPosition>,
  ) {
    if (!hasRequiredRefs()) {
      return;
    }

    const { height, width } = dropdownListRef.value!.getBoundingClientRect();

    let left: number;
    let top: number;

    if (dropdownPosition) {
      left = dropdownPosition.clientX;
      top = dropdownPosition.clientY;

      if (top + height > globalThis.innerHeight) {
        top = Math.max(0, dropdownPosition.clientY - height);
      }

      if (left + width > globalThis.innerWidth) {
        left = Math.max(0, dropdownPosition.clientX - width);
      }
    } else {
      const {
        bottom: dropdownBottom,
        left: dropdownLeft,
        right: dropdownRight,
        top: dropdownTop,
      } = dropdownMenuRef.value!.getBoundingClientRect();

      left = dropdownLeft;
      top = dropdownBottom;

      if (top + height > globalThis.innerHeight) {
        top = Math.max(0, dropdownTop - height);
      }

      if (left + width > globalThis.innerWidth) {
        left = Math.max(0, dropdownRight - width);
      }
    }

    menuStyle.value = {
      left: `${left}px`,
      top: `${top}px`,
    };
  }

  function cleanup() {
    menuStyle.value = {};
    abortController.value?.abort();
    abortController.value = null;
    unlockScroll();
  }

  function closeDropdownMenu() {
    if (activeMenuId.value === menuId) {
      activeCleanup?.();
      activeMenuId.value = null;
      activeCleanup = null;
    }
  }

  function onClick(event: MouseEvent) {
    if (!hasRequiredRefs()) {
      return;
    }

    const target = event.target as Node;
    const isClickInsideMenu = dropdownMenuRef.value!.contains(target);
    const isClickInsideList = dropdownListRef.value!.contains(target);

    // Only keep dropdown open if click is inside the dropdown menu
    // but not inside the dropdown list.
    if (isClickInsideMenu && !isClickInsideList) {
      return;
    }

    closeDropdownMenu();
  }

  function onContextMenu() {
    closeDropdownMenu();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDropdownMenu();
    }
  }

  function hasRequiredRefs() {
    return dropdownMenuRef.value && dropdownListRef.value;
  }

  async function openDropdownMenu(event?: MouseEvent | TouchEvent) {
    const currentDropdownMenuPosition = getPointerPosition(event);
    openMenuInternal();
    setupListeners();

    await nextTick();

    positionDropdownMenu(currentDropdownMenuPosition);
  }

  function openMenuInternal() {
    if (activeMenuId.value !== menuId) {
      activeCleanup?.();
    }

    activeMenuId.value = menuId;
    activeCleanup = cleanup;
  }

  function setupListeners() {
    lockScroll();
    abortController.value = new AbortController();
    const { signal } = abortController.value;

    globalThis.addEventListener('click', onClick, { signal });
    globalThis.addEventListener('contextmenu', onContextMenu, { signal });
    document.addEventListener('keydown', onKeydown, { signal });
  }

  onBeforeUnmount(() => {
    closeDropdownMenu();
  });

  return {
    closeDropdownMenu,
    isOpen,
    menuStyle,
    openDropdownMenu,
  };
}
