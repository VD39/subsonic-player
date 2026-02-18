const activeLocks = new Set<string>();

export function useScrollLock(key: string, globalClasses?: string[]) {
  function lockScroll() {
    if (!import.meta.client) {
      return;
    }

    activeLocks.add(key);

    document.body.classList.add('lockScroll');

    if (globalClasses) {
      document.body.classList.add(...globalClasses);
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

    if (globalClasses) {
      document.body.classList.remove(...globalClasses);
    }
  }

  return {
    lockScroll,
    unlockScroll,
  };
}
