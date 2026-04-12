export function getIndex(array: MixedTrack[], id: string) {
  return array.findIndex(({ id: itemId }) => itemId === id);
}

export function getPreviousTrack(
  queue: MixedTrack[],
  currentIndex: number,
  repeat: number,
): MixedTrack[] {
  if (
    !queue.length ||
    (currentIndex <= 0 && repeat !== Number.POSITIVE_INFINITY)
  ) {
    return [];
  }

  const totalTracks = queue.length;
  const index = currentIndex <= 0 ? totalTracks - 1 : currentIndex - 1;
  const track = queue[index];

  return isPreloadable(track) ? [track] : [];
}

export function getTracksToPreload(
  queue: MixedTrack[],
  currentIndex: number,
  repeat: number,
): MixedTrack[] {
  return [
    ...getUpcomingTracks(queue, currentIndex, repeat),
    ...getPreviousTrack(queue, currentIndex, repeat),
  ];
}

export function getUpcomingTracks(
  queue: MixedTrack[],
  currentIndex: number,
  repeat: number,
): MixedTrack[] {
  if (!queue.length || PREFETCH_TRACK_COUNT <= 0) {
    return [];
  }

  const upcoming: MixedTrack[] = [];
  const totalTracks = queue.length;

  for (
    let i = 1;
    i <= totalTracks && upcoming.length < PREFETCH_TRACK_COUNT;
    i++
  ) {
    const index = currentIndex + i;

    // Without repeat-all, stop at queue end.
    if (index >= totalTracks && repeat !== Number.POSITIVE_INFINITY) {
      break;
    }

    const track = queue[index % totalTracks];

    if (!isPreloadable(track)) {
      continue;
    }

    upcoming.push(track);
  }

  return upcoming;
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

function isPreloadable(track: MixedTrack) {
  return track.type !== MEDIA_TYPE.radioStation && !!track.streamUrlId;
}
