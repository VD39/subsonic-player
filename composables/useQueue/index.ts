export function useQueue() {
  const { lockScroll, unlockScroll } = useScrollLock('queue');

  const isQueueListOpened = useState(STATE_NAMES.queueListOpened, () => false);
  const isQueuePlayerOpened = useState(
    STATE_NAMES.queuePlayerOpened,
    () => false,
  );

  function toggleLockScroll() {
    if (isQueueListOpened.value || isQueuePlayerOpened.value) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }

  function toggleQueuePlayer() {
    isQueuePlayerOpened.value = !isQueuePlayerOpened.value;
    toggleLockScroll();
  }

  function toggleQueueList() {
    isQueueListOpened.value = !isQueueListOpened.value;
    toggleLockScroll();
  }

  function resetQueue() {
    isQueueListOpened.value = false;
    isQueuePlayerOpened.value = false;

    unlockScroll();
  }

  return {
    isQueueListOpened,
    isQueuePlayerOpened,
    resetQueue,
    toggleQueueList,
    toggleQueuePlayer,
  };
}
