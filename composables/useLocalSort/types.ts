export interface BaseSortOption {
  defaultDirection: SortDirection;
  key: string;
  label: string;
}

export interface SortButtonsProps {
  activeSort: string;
  onSelectSort: (key: string) => void;
  onToggleDirection: () => void;
  options: BaseSortOption[];
  sortDirection: SortDirection;
}

export type SortDirection = 'asc' | 'desc' | 'random';

export interface SortOption<T> extends BaseSortOption {
  key: keyof T & string;
}

export interface UseLocalSortOptions<T> {
  items: ComputedRef<T[]> | Ref<T[]>;
  options?: SortOption<T>[];
}

export interface UseLocalSortReturn<T> {
  sortedItems: ComputedRef<T[]>;
  sortProps: ComputedRef<SortButtonsProps>;
}
