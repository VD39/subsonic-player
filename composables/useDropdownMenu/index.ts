let activeCleanup: (() => void) | null = null;

export function useDropdownMenu(options: DropdownOptions) {
  const { lockScroll, unlockScroll } = useScrollLock([
    'disableAllPointerEvents',
  ]);

  const activeMenuId = useState<null | string>(
    STATE_NAMES.dropdownActiveMenuId,
    () => null,
  );

  const menuId = crypto.randomUUID();
  const { dropdownListRef, dropdownMenuRef } = options;

  let abortController: AbortController | null = null;

  const menuStyle = ref<Record<string, string>>({});

  const isOpen = computed(() => activeMenuId.value === menuId);

  function positionDropdownMenu(dropdownPosition?: DropdownPosition) {
    if (!hasRequiredRefs()) {
      return;
    }

    const { height, width } = dropdownListRef.value!.getBoundingClientRect();

    let left: number;
    let top: number;

    if (dropdownPosition) {
      left = dropdownPosition.x;
      top = dropdownPosition.y;

      if (top + height > globalThis.innerHeight) {
        top = Math.max(0, dropdownPosition.y - height);
      }

      if (left + width > globalThis.innerWidth) {
        left = Math.max(0, dropdownPosition.x - width);
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
    abortController?.abort();
    abortController = null;
    unlockScroll();
  }

  function closeDropdownMenu() {
    if (activeMenuId.value === menuId) {
      activeCleanup?.();
      activeMenuId.value = null;
      activeCleanup = null;
    }
  }

  function getCurrentDropdownMenuPosition(
    event?: MouseEvent | TouchEvent,
  ): DropdownPosition | undefined {
    if (!event) {
      return undefined;
    }

    if ('touches' in event) {
      const touch = event.touches[0] || event.changedTouches[0];

      if (!touch) {
        return undefined;
      }

      return {
        x: touch.clientX,
        y: touch.clientY,
      };
    }

    if ('clientX' in event) {
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }

    return undefined;
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
    const currentDropdownMenuPosition = getCurrentDropdownMenuPosition(event);
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
    abortController = new AbortController();
    const { signal } = abortController;

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
