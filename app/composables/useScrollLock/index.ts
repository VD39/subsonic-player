const activeLocks = new Set<string>();

export function useScrollLock(key: string, bodyClasses?: string[]) {
  function lockScroll() {
    if (!import.meta.client) {
      return;
    }

    activeLocks.add(key);

    document.body.classList.add('lockScroll');

    if (bodyClasses) {
      document.body.classList.add(...bodyClasses);
    }
  }

  function unlockScroll() {
    if (!import.meta.client) {
      return;
    }

    activeLocks.delete(key);

    if (activeLocks.size === 0) {
      document.body.classList.remove('lockScroll');
    }

    if (bodyClasses) {
      document.body.classList.remove(...bodyClasses);
    }
  }

  return {
    lockScroll,
    unlockScroll,
  };
}
