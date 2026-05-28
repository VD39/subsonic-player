export function pruneOriginalQueue(
  shuffledQueue: PlayableTrack[],
  originalQueue: PlayableTrack[],
) {
  const tracksAIds = new Set(shuffledQueue.map((track) => track.id));
  return originalQueue.filter((track) => tracksAIds.has(track.id));
}

export function shuffleTrackInQueue(queue: PlayableTrack[], index = 0) {
  [queue[0], queue[index]] = [queue[index], queue[0]];

  const rest = queue.splice(1);
  queue.push(...shuffleArray(rest));

  return queue;
}
