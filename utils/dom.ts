export function findClosestElement(
  target: EventTarget | null,
  className: string,
) {
  if (!(target instanceof Element)) {
    return null;
  }

  const element = target.closest(`.${className}`);

  return element instanceof HTMLElement ? element : null;
}
