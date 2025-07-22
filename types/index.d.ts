declare module '@dragdroptouch/drag-drop-touch' {
  export interface EnableDragDropTouchOptions {
    allowDragScroll?: boolean;
    contextMenuDelayMS?: number;
    dragImageOpacity?: number;
    dragScrollPercentage?: number;
    dragScrollSpeed?: number;
    dragThresholdPixels?: number;
    forceListen?: boolean;
    isPressHoldMode?: boolean;
    pressHoldDelayMS?: number;
    pressHoldMargin?: number;
    pressHoldThresholdPixels?: number;
  }

  export function enableDragDropTouch(
    rootElement?: Document | HTMLElement,
    targetElement?: Document | HTMLElement,
    options?: EnableDragDropTouchOptions,
  ): void;
}
