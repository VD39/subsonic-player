export function getPointerPosition(event?: MouseEvent | TouchEvent) {
  if (!event) {
    return undefined;
  }

  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];

    return touch || undefined;
  }

  return event;
}
