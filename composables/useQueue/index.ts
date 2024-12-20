export function useQueue() {
  const queuePlayerOpened = useState(
    STATE_NAMES.queuePlayerOpened,
    () => false,
  );
  const queueListOpened = useState(STATE_NAMES.queueListOpened, () => false);

  function toggleQueuePlayer() {
    queuePlayerOpened.value = !queuePlayerOpened.value;
  }

  function toggleQueueList() {
    queueListOpened.value = !queueListOpened.value;
  }

  function resetQueueState() {
    queueListOpened.value = false;
    queuePlayerOpened.value = false;
  }

  return {
    queueListOpened,
    queuePlayerOpened,
    resetQueueState,
    toggleQueueList,
    toggleQueuePlayer,
  };
}
