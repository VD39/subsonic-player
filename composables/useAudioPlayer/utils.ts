export function getIndex(array: QueueTrack[], id: string) {
  return array.findIndex(({ id: itemId }) => itemId === id);
}

export function shuffleArray(queueArray: QueueTrack[], currentIndex = 0) {
  [queueArray[0], queueArray[currentIndex]] = [
    queueArray[currentIndex],
    queueArray[0],
  ];

  const start = 1;

  for (let i = queueArray.length - 1; i > start; i--) {
    const j = Math.floor(Math.random() * (i - start + 1) + start);
    [queueArray[i], queueArray[j]] = [queueArray[j], queueArray[i]];
  }

  return queueArray;
}
