export function useQueue() {
  const isQueueListOpened = useState(STATE_NAMES.queueListOpened, () => false);
  const isQueuePlayerOpened = useState(
    STATE_NAMES.queuePlayerOpened,
    () => false,
  );

  function toggleQueuePlayer() {
    isQueuePlayerOpened.value = !isQueuePlayerOpened.value;
  }

  function toggleQueueList() {
    isQueueListOpened.value = !isQueueListOpened.value;
  }

  function resetQueue() {
    isQueueListOpened.value = false;
    isQueuePlayerOpened.value = false;
  }

  return {
    isQueueListOpened,
    isQueuePlayerOpened,
    resetQueue,
    toggleQueueList,
    toggleQueuePlayer,
  };
}
