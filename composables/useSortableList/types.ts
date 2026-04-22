export interface SortableListOptions {
  listContainerRef: ReturnType<typeof useTemplateRef>;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}
