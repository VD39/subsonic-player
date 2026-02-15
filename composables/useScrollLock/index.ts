export function useScrollLock(globalClasses?: string[]) {
  function lockScroll() {
    document.body.classList.add('lockScroll');

    if (globalClasses) {
      document.body.classList.add(...globalClasses);
    }
  }

  function unlockScroll() {
    document.body.classList.remove('lockScroll');

    if (globalClasses) {
      document.body.classList.remove(...globalClasses);
    }
  }

  return {
    lockScroll,
    unlockScroll,
  };
}
