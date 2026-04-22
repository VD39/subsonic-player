export function useSortableList(options: SortableListOptions) {
  const { listContainerRef, onReorder } = options;

  const { isDragging } = useSortableListState();

  // DOM references.
  const draggedItem = ref<HTMLElement | null>(null);
  const spacerElement = ref<HTMLElement | null>(null);
  const scrollableAncestor = ref<HTMLElement | null>(null);
  const items = ref<HTMLElement[]>([]);

  // Event management.
  const abortController = ref<AbortController | null>(null);
  const dragAbortController = ref<AbortController | null>(null);
  const animationFrameId = ref<null | number>(null);

  // Touch long-press state.
  const longPressTimer = ref<null | ReturnType<typeof setTimeout>>(null);
  const pendingTouchStartX = ref(0);
  const pendingTouchStartY = ref(0);

  let listMutationObserver: MutationObserver | null = null;
  const dragState = createInitialDragState();

  function resolveListContainer() {
    return getListContainerElement(listContainerRef.value);
  }

  function createInitialDragState() {
    return {
      containerHeight: 0,
      containerTop: 0,
      initialItemRects: new Map<HTMLElement, DOMRect>(),
      initialItemTop: 0,
      initialScrollTop: 0,
      isAutoScrolling: false,
      itemHeight: 0,
      lastPointerY: 0,
      pointerStartY: 0,
    };
  }

  // Clears the cached items list and re-queries the DOM, marking all items as idle.
  function refreshSortableItems() {
    items.value = [];
    getSortableListItems().forEach((item) => {
      item.classList.add(SORTABLE_LIST_CLASS_NAMES.idle);
    });
  }

  // Lazily queries and caches all sortable item elements within the container.
  function getSortableListItems() {
    const listContainerElement = resolveListContainer();

    if (!items.value.length && listContainerElement) {
      items.value = Array.from(
        listContainerElement.querySelectorAll(
          `.${SORTABLE_LIST_CLASS_NAMES.item}`,
        ),
      );
    }

    return items.value;
  }

  // Returns only the items that are not currently being dragged.
  function getIdleSortableItems() {
    return getSortableListItems().filter((item) =>
      item.classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
    );
  }

  // Binds all event listeners (mouse/touch) to the list container and sets up
  // a MutationObserver to re-sync items when children are added or removed.
  function setupSortableInteractions() {
    const listContainerElement = resolveListContainer();

    if (!listContainerElement) {
      return;
    }

    // Tear down any previous listeners before re-attaching.
    abortController.value?.abort();
    listMutationObserver?.disconnect();

    refreshSortableItems();

    abortController.value = new AbortController();
    const { signal } = abortController.value;

    listContainerElement.addEventListener('mousedown', handlePointerDown, {
      signal,
    });
    listContainerElement.addEventListener('touchstart', handlePointerDown, {
      passive: true,
      signal,
    });
    document.addEventListener('touchmove', handleTouchMoveBeforeDrag, {
      passive: true,
      signal,
    });
    document.addEventListener('mouseup', handlePointerUp, {
      signal,
    });
    document.addEventListener('touchend', handlePointerUp, {
      signal,
    });
    document.addEventListener('touchcancel', handlePointerUp, {
      signal,
    });

    listMutationObserver = new MutationObserver(() => {
      requestAnimationFrame(() => {
        if (!isDragging.value) {
          refreshSortableItems();
        }
      });
    });

    listMutationObserver.observe(listContainerElement, {
      childList: true,
      subtree: false,
    });
  }

  function cancelLongPress() {
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
  }

  // Handles mousedown/touchstart - finds the drag handle and sortable item,
  // then either starts a drag immediately (mouse) or begins a long-press timer (touch).
  function handlePointerDown(event: MouseEvent | TouchEvent) {
    // Ignore if a drag is already in progress.
    if (draggedItem.value) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (!findClosestElement(target, SORTABLE_LIST_CLASS_NAMES.dragHandle)) {
      return;
    }

    const sortableItemElement = findClosestElement(
      target,
      SORTABLE_LIST_CLASS_NAMES.item,
    );

    if (!sortableItemElement) {
      return;
    }

    if (event instanceof TouchEvent) {
      startLongPressTimer(event, sortableItemElement);
      return;
    }

    event.preventDefault();
    setDraggingState(true);
    initializeDragSession(
      sortableItemElement,
      getPointerPosition(event)?.clientY || 0,
    );
  }

  // Starts a long-press timer for touch drag initiation.
  function startLongPressTimer(event: TouchEvent, element: HTMLElement) {
    const position = getPointerPosition(event);
    const startX = position?.clientX || 0;
    const startY = position?.clientY || 0;

    pendingTouchStartX.value = startX;
    pendingTouchStartY.value = startY;

    cancelLongPress();
    longPressTimer.value = setTimeout(() => {
      longPressTimer.value = null;
      navigator.vibrate?.(50);
      setDraggingState(true);
      initializeDragSession(element, startY);
    }, TOUCH_LONG_PRESS_DELAY);
  }

  // Cancels the long-press if the finger moves too far before the timer fires.
  function handleTouchMoveBeforeDrag(event: TouchEvent) {
    if (longPressTimer.value === null) {
      return;
    }

    const position = getPointerPosition(event);
    const touchMovedX = Math.abs(
      (position?.clientX || 0) - pendingTouchStartX.value,
    );
    const touchMovedY = Math.abs(
      (position?.clientY || 0) - pendingTouchStartY.value,
    );

    if (
      touchMovedX > TOUCH_MOVE_TOLERANCE ||
      touchMovedY > TOUCH_MOVE_TOLERANCE
    ) {
      cancelLongPress();
    }
  }

  // Sets up all state needed for a drag: captures initial positions of every item,
  // finds the scrollable ancestor, and starts auto-scroll + pointer-move listeners.
  function initializeDragSession(item: HTMLElement, startY: number) {
    draggedItem.value = item;
    dragState.pointerStartY = startY;
    dragState.lastPointerY = startY;

    const listContainerElement = resolveListContainer();
    scrollableAncestor.value =
      findScrollableParentElement(listContainerElement);
    dragState.initialScrollTop = getCurrentScrollTop(scrollableAncestor.value);
    dragState.containerTop =
      listContainerElement?.getBoundingClientRect().top || 0;
    dragState.containerHeight = listContainerElement?.scrollHeight || 0;

    items.value = [];
    dragState.initialItemRects.clear();
    getSortableListItems().forEach((item) => {
      dragState.initialItemRects.set(item, item.getBoundingClientRect());
    });

    setDocumentDraggingStyles(true);
    initializeDraggedItem();
    initializeIdleItemPositions();

    stopAutoScroll();
    animationFrameId.value = requestAnimationFrame(performAutoScroll);

    dragAbortController.value?.abort();
    dragAbortController.value = new AbortController();
    const { signal: dragSignal } = dragAbortController.value;

    document.addEventListener('mousemove', handlePointerMove, {
      signal: dragSignal,
    });
    document.addEventListener('touchmove', handlePointerMove, {
      passive: false,
      signal: dragSignal,
    });
  }

  // Pulls the dragged item out of normal flow by positioning it absolutely,
  // and inserts a spacer div to keep the remaining items spaced correctly.
  function initializeDraggedItem() {
    if (!draggedItem.value) {
      return;
    }

    const listContainerElement = resolveListContainer();
    const rect = draggedItem.value.getBoundingClientRect();
    const containerRect = listContainerElement?.getBoundingClientRect();

    dragState.initialItemTop = rect.top;
    dragState.itemHeight = rect.height;

    spacerElement.value = document.createElement('div');
    spacerElement.value.style.height = `${rect.height}px`;
    draggedItem.value.parentNode?.insertBefore(
      spacerElement.value,
      draggedItem.value.nextSibling,
    );

    draggedItem.value.classList.remove(SORTABLE_LIST_CLASS_NAMES.idle);
    draggedItem.value.classList.add(SORTABLE_LIST_CLASS_NAMES.draggable);

    const top = rect.top - (containerRect?.top || 0);
    const left = rect.left - (containerRect?.left || 0);

    Object.assign(draggedItem.value.style, {
      left: `${left}px`,
      position: 'absolute',
      top: `${top}px`,
      width: `${rect.width}px`,
    });
  }

  // Marks items that are initially above the dragged item so we know
  // which direction to shift them when the dragged item passes over them.
  function initializeIdleItemPositions() {
    if (!draggedItem.value) {
      return;
    }

    const draggedIndex = getSortableListItems().indexOf(draggedItem.value);

    getIdleSortableItems().forEach((item, index) => {
      if (draggedIndex > index) {
        item.dataset.isAbove = '';
      }
    });
  }

  // Moves the dragged item to follow the pointer, clamped within the container bounds,
  // and recalculates which idle items should shift to make room.
  function handlePointerMove(event: MouseEvent | TouchEvent) {
    if (!draggedItem.value) {
      return;
    }

    event.preventDefault();

    const clientY =
      getPointerPosition(event)?.clientY || dragState.pointerStartY;

    dragState.lastPointerY = clientY;
    draggedItem.value.style.top = `${limitDragTop(calculateItemTopInContainer(clientY), dragState.containerHeight, dragState.itemHeight)}px`;

    updateIdleItemPositions();
  }

  // Converts a viewport clientY into a container-relative top position,
  // clamped within the drag bounds and adjusted for scroll offset.
  function calculateItemTopInContainer(clientY: number) {
    const pointerToItemTopOffset =
      dragState.pointerStartY - dragState.initialItemTop;
    const itemTopInViewport = clientY - pointerToItemTopOffset;

    const dragBounds = getDragBounds(scrollableAncestor.value);
    const clampedItemTopInViewport = Math.min(
      Math.max(itemTopInViewport, dragBounds.top),
      dragBounds.bottom - dragState.itemHeight,
    );
    const scrollOffsetSinceDragStart =
      getCurrentScrollTop(scrollableAncestor.value) -
      dragState.initialScrollTop;

    return (
      clampedItemTopInViewport -
      dragState.containerTop +
      scrollOffsetSinceDragStart
    );
  }

  // Compares the dragged item's center Y to each idle item's center Y and
  // applies a translateY shift to items that the dragged item has crossed over.
  function updateIdleItemPositions() {
    if (!draggedItem.value) {
      return;
    }

    const draggedItemTop = Number.parseFloat(draggedItem.value.style.top) || 0;
    const draggedItemMidY = draggedItemTop + dragState.itemHeight / 2;

    getIdleSortableItems().forEach((item) => {
      const initialRect = dragState.initialItemRects.get(item);

      if (!initialRect) {
        return;
      }

      const idleItemTopInContainer = initialRect.top - dragState.containerTop;
      const idleItemMidY = idleItemTopInContainer + initialRect.height / 2;
      const isAbove = isItemInitiallyAbove(item);

      const shouldShift = isAbove
        ? draggedItemMidY <= idleItemMidY
        : draggedItemMidY >= idleItemMidY;

      if (shouldShift) {
        item.dataset.isShifted = '';
        const direction = isAbove ? 1 : -1;
        item.style.transform = `translateY(${direction * dragState.itemHeight}px)`;
      } else {
        delete item.dataset.isShifted;
        item.style.transform = '';
      }
    });
  }

  // Toggles CSS transitions on the given items - disabled during auto-scroll
  // for smooth continuous movement, re-enabled when scrolling stops.
  function setItemTransitions(itemList: HTMLElement[], enabled: boolean) {
    itemList.forEach((item) => {
      item.style.transition = enabled ? '' : 'none';
    });
  }

  // Runs every animation frame: scrolls the container when the pointer is near
  // the edges, and adjusts the dragged item's position to compensate for the scroll.
  function performAutoScroll() {
    if (!draggedItem.value) {
      return;
    }

    const rawScrollSpeed = getAutoScrollSpeed(
      dragState.lastPointerY,
      resolveListContainer(),
    );
    const speed =
      rawScrollSpeed > 0
        ? Math.ceil(rawScrollSpeed)
        : Math.floor(rawScrollSpeed);

    if (speed !== 0) {
      if (!dragState.isAutoScrolling) {
        dragState.isAutoScrolling = true;
        setItemTransitions(getIdleSortableItems(), false);
      }

      const scrollTopBefore = getCurrentScrollTop(scrollableAncestor.value);
      scrollContainerBy(scrollableAncestor.value, speed);
      const scrollTopAfter = getCurrentScrollTop(scrollableAncestor.value);
      const scrollDelta = scrollTopAfter - scrollTopBefore;

      if (scrollDelta !== 0) {
        const currentItemTop =
          Number.parseFloat(draggedItem.value.style.top) || 0;
        draggedItem.value.style.top = `${limitDragTop(currentItemTop + scrollDelta, dragState.containerHeight, dragState.itemHeight)}px`;
        updateIdleItemPositions();
      }
    } else if (dragState.isAutoScrolling) {
      dragState.isAutoScrolling = false;
      setItemTransitions(getIdleSortableItems(), true);
    }

    animationFrameId.value = requestAnimationFrame(performAutoScroll);
  }

  function stopAutoScroll() {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }

    if (dragState.isAutoScrolling) {
      dragState.isAutoScrolling = false;
      setItemTransitions(getIdleSortableItems(), true);
    }
  }

  // Determines the final from/to indices by looking at which items shifted -
  // the gap left in the reordered array is where the dragged item should land.
  function getReorderTargetIndices() {
    const sortableListItems = getSortableListItems();

    if (!draggedItem.value) {
      return {
        fromIndex: -1,
        toIndex: -1,
      };
    }

    const reorderedItems: (HTMLElement | undefined)[] = [];

    sortableListItems.forEach((item, index) => {
      if (item === draggedItem.value) {
        return;
      }

      if (!isItemShifted(item)) {
        reorderedItems[index] = item;
        return;
      }

      const shiftedIndex = isItemInitiallyAbove(item) ? index + 1 : index - 1;
      reorderedItems[shiftedIndex] = item;
    });

    let toIndex = -1;

    for (let index = 0; index < sortableListItems.length; index++) {
      if (reorderedItems[index] === undefined) {
        toIndex = index;
        break;
      }
    }

    return {
      fromIndex: sortableListItems.indexOf(draggedItem.value),
      toIndex,
    };
  }

  // Ends the drag: calculates the new order, cleans up all drag state,
  // and fires the onReorder callback if the item actually moved.
  function handlePointerUp() {
    cancelLongPress();

    if (!draggedItem.value) {
      return;
    }

    const { fromIndex, toIndex } = getReorderTargetIndices();
    const sortableListItems = getSortableListItems();

    setItemTransitions(sortableListItems, false);
    cleanupDragSession();

    if (toIndex !== -1 && toIndex !== fromIndex) {
      onReorder?.(fromIndex, toIndex);
    }

    setDraggingState(false);
    nextTick(() => setItemTransitions(sortableListItems, true));
  }

  // Restores the dragged item back to normal flow and removes the spacer.
  function resetDraggedItem() {
    if (!draggedItem.value) {
      return;
    }

    Object.assign(draggedItem.value.style, {
      left: '',
      position: '',
      top: '',
      transform: '',
      width: '',
    });

    draggedItem.value.classList.remove(SORTABLE_LIST_CLASS_NAMES.draggable);
    draggedItem.value.classList.add(SORTABLE_LIST_CLASS_NAMES.idle);

    spacerElement.value?.remove();
    spacerElement.value = null;
    draggedItem.value = null;
  }

  // Clears all shift-tracking data attributes and transforms from idle items.
  function resetIdleItems() {
    getIdleSortableItems().forEach((item) => {
      delete item.dataset.isAbove;
      delete item.dataset.isShifted;
      item.style.transform = '';
    });
  }

  function resetDragState() {
    Object.assign(dragState, createInitialDragState());
  }

  // Full teardown of a single drag session - resets items, stops scrolling,
  // removes drag listeners, and clears all transient drag state.
  function cleanupDragSession() {
    cancelLongPress();
    stopAutoScroll();
    resetIdleItems();
    resetDraggedItem();

    items.value = [];
    scrollableAncestor.value = null;

    setDocumentDraggingStyles(false);
    dragAbortController.value?.abort();
    dragAbortController.value = null;
    resetDragState();
  }

  // Updates the shared dragging flag - uses setTimeout(0) when disabling
  // so that click handlers on items can still check isDragging before it clears.
  function setDraggingState(value: boolean) {
    if (value) {
      isDragging.value = true;
      return;
    }

    setTimeout(() => {
      isDragging.value = false;
    }, 0);
  }

  // Tears down everything: any active drag, all event listeners, and the mutation observer.
  function cleanupSortableInteractions() {
    cleanupDragSession();
    abortController.value?.abort();
    abortController.value = null;
    listMutationObserver?.disconnect();
    listMutationObserver = null;
  }

  // Re-initialize whenever the list container ref changes (e.g. conditional rendering).
  watch(
    () => listContainerRef.value,
    () => {
      nextTick(() => {
        setupSortableInteractions();
      });
    },
  );

  onBeforeUnmount(() => {
    cleanupSortableInteractions();
  });
}
