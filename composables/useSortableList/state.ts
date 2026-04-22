export function useSortableListState() {
  const isDragging = useState<boolean>(
    STATE_NAMES.sortableIsDragging,
    () => false,
  );

  return {
    isDragging,
  };
}
