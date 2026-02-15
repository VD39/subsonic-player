export interface DataMock {
  data: unknown;
  error?: Error | null;
}

export type EventCallback = (
  event?: Partial<DragEvent | Event | KeyboardEvent | MouseEvent | TouchEvent>,
) => void;
