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

export function isInteractiveElement(target: EventTarget | null) {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLButtonElement ||
    target instanceof HTMLAnchorElement ||
    target.isContentEditable
  ) {
    return true;
  }

  return INTERACTIVE_ROLES.includes(target.getAttribute('role') || '');
}
