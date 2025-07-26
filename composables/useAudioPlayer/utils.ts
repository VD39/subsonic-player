export function getIndex(array: MixedTrack[], id: string) {
  return array.findIndex(({ id: itemId }) => itemId === id);
}

export function removeRemovedTracksFromOriginalQueue(
  shuffledQueue: MixedTrack[],
  originalQueue: MixedTrack[],
) {
  const tracksAIds = new Set(shuffledQueue.map((track) => track.id));
  return originalQueue.filter((track) => tracksAIds.has(track.id));
}

export function shuffleTrackInQueue(queue: MixedTrack[], index = 0) {
  [queue[0], queue[index]] = [queue[index], queue[0]];

  const start = 1;

  for (let i = queue.length - 1; i > start; i--) {
    const j = Math.floor(Math.random() * (i - start + 1) + start);
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  return queue;
}
