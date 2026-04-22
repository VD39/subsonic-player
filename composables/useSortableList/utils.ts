export function findScrollableParentElement(startElement: HTMLElement | null) {
  let element = startElement?.parentElement || null;
  const scrollableValues = new Set(['auto', 'scroll']);

  while (element && element !== document.documentElement) {
    const { overflow, overflowY } = getComputedStyle(element);

    if (scrollableValues.has(overflow) || scrollableValues.has(overflowY)) {
      return element;
    }

    element = element.parentElement;
  }

  return null;
}

export function getAutoScrollSpeed(
  pointerY: number,
  container: HTMLElement | null,
) {
  if (!container) {
    return 0;
  }

  const containerRect = container.getBoundingClientRect();
  const visibleTop = Math.max(containerRect.top, 0);
  const visibleBottom = Math.min(containerRect.bottom, globalThis.innerHeight);

  if (pointerY < visibleTop + AUTO_SCROLL_THRESHOLD) {
    const proximity = 1 - (pointerY - visibleTop) / AUTO_SCROLL_THRESHOLD;
    return -AUTO_SCROLL_MAX_SPEED * Math.min(Math.max(proximity, 0), 1);
  }

  if (pointerY > visibleBottom - AUTO_SCROLL_THRESHOLD) {
    const proximity = 1 - (visibleBottom - pointerY) / AUTO_SCROLL_THRESHOLD;
    return AUTO_SCROLL_MAX_SPEED * Math.min(Math.max(proximity, 0), 1);
  }

  return 0;
}

export function getCurrentScrollTop(scrollableAncestor: HTMLElement | null) {
  return scrollableAncestor ? scrollableAncestor.scrollTop : globalThis.scrollY;
}

export function getDragBounds(scrollableAncestor: HTMLElement | null) {
  if (scrollableAncestor) {
    const rect = scrollableAncestor.getBoundingClientRect();
    return {
      bottom: Math.min(rect.bottom, globalThis.innerHeight),
      top: Math.max(rect.top, 0),
    };
  }

  const styles = getComputedStyle(document.body);
  const headerHeight =
    Number.parseInt(styles.getPropertyValue('--header-height'), 10) || 0;
  const sidebarBottom =
    Number.parseInt(styles.getPropertyValue('--sidebar-bottom'), 10) || 0;

  return {
    bottom: globalThis.innerHeight - sidebarBottom,
    top: headerHeight,
  };
}

export function getListContainerElement(
  listContainer: ReturnType<typeof useTemplateRef>['value'],
) {
  if (!listContainer) {
    return null;
  }

  if (listContainer instanceof HTMLElement) {
    return listContainer;
  }

  const element = (listContainer as ComponentPublicInstance).$el;

  if (element instanceof HTMLElement) {
    return element;
  }

  return (element?.nextElementSibling as HTMLElement) || null;
}

export function isItemInitiallyAbove(item: HTMLElement) {
  return 'isAbove' in item.dataset;
}

export function isItemShifted(item: HTMLElement) {
  return 'isShifted' in item.dataset;
}

export function limitDragTop(
  dragTop: number,
  containerHeight: number,
  itemHeight: number,
) {
  const maxTop = containerHeight - itemHeight + OVERFLOW_ALLOWANCE;

  return Math.max(-OVERFLOW_ALLOWANCE, Math.min(dragTop, maxTop));
}

export function scrollContainerBy(
  scrollableAncestor: HTMLElement | null,
  pixels: number,
) {
  if (scrollableAncestor) {
    scrollableAncestor.scrollTop += pixels;
  } else {
    globalThis.scrollBy(0, pixels);
  }
}

export function setDocumentDraggingStyles(enabled: boolean) {
  document.body.style.touchAction = enabled ? 'none' : '';
  document.body.style.userSelect = enabled ? 'none' : '';
  document.documentElement.style.scrollBehavior = enabled ? 'auto' : '';
}
