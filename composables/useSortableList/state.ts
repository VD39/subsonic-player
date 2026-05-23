export function useSortableListState() {
  const isDragging = useState<boolean>(
    STATE_NAMES.sortableIsDragging,
    () => false,
  );

  // Updates the shared dragging flag - uses setTimeout(0) when disabling
  // so that click handlers on items can still check isDragging before it clears.
  function setDraggingState(dragging: boolean) {
    if (dragging) {
      isDragging.value = true;
      return;
    }

    setTimeout(() => {
      isDragging.value = false;
    }, 0);
  }

  return {
    isDragging,
    setDraggingState,
  };
}
