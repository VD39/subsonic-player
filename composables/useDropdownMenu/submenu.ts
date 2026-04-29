export function useDropdownSubmenu(options: DropdownSubmenuOptions) {
  const { dropdownSubListRef, dropdownSubmenuRef } = options;

  const { openEventCount } = useDropdownMenuState();

  const isOpen = ref(false);
  const openedLeft = ref(false);
  const isHoverDevice = ref(false);
  const submenuStyle = ref<Record<string, string>>({});
  const abortController = ref<AbortController | null>(null);

  const debouncedClose = debounce(closeSubmenu, 100);

  function closeSubmenu() {
    isOpen.value = false;
    openedLeft.value = false;
    submenuStyle.value = {};
    abortController.value?.abort();
    abortController.value = null;
  }

  function onSiblingMouseover(event: MouseEvent) {
    if (!dropdownSubmenuRef.value?.contains(event.target as Node)) {
      debouncedClose();
    }
  }

  function positionSubmenu() {
    if (!dropdownSubmenuRef.value || !dropdownSubListRef.value) {
      return;
    }

    const { height, width } = dropdownSubListRef.value.getBoundingClientRect();
    const {
      left: dropdownMenuLeft,
      right: dropdownMenuRight,
      top: dropdownMenuTop,
    } = dropdownSubmenuRef.value.getBoundingClientRect();

    let left: number;
    let top = dropdownMenuTop;

    if (dropdownMenuRight + width > globalThis.innerWidth) {
      left = Math.max(0, dropdownMenuLeft - width);
      openedLeft.value = true;
    } else {
      left = dropdownMenuRight;
      openedLeft.value = false;
    }

    if (top + height > globalThis.innerHeight) {
      top = Math.max(0, globalThis.innerHeight - height);
    }

    submenuStyle.value = {
      left: `${left}px`,
      top: `${top}px`,
    };
  }

  async function openSubmenu() {
    if (!isHoverDevice.value) {
      return;
    }

    debouncedClose.cancel();
    isOpen.value = true;

    await nextTick();
    positionSubmenu();

    const parentList = dropdownSubmenuRef.value?.parentElement;

    if (parentList) {
      abortController.value?.abort();
      abortController.value = new AbortController();
      const { signal } = abortController.value;

      parentList.addEventListener('mouseover', onSiblingMouseover, {
        signal,
      });
    }
  }

  function toggleInline(event: MouseEvent) {
    if (isHoverDevice.value) {
      return;
    }

    event.stopPropagation();

    isOpen.value = !isOpen.value;
  }

  watch(openEventCount, () => {
    closeSubmenu();
  });

  onMounted(() => {
    isHoverDevice.value = !!globalThis.matchMedia?.('(hover: hover)').matches;
  });

  onBeforeUnmount(() => {
    closeSubmenu();
  });

  return {
    closeSubmenu,
    isHoverDevice,
    isOpen,
    openedLeft,
    openSubmenu,
    submenuStyle,
    toggleInline,
  };
}
