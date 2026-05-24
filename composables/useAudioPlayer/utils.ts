export function getPreviousTrack(
  queue: PlayableTrack[],
  currentIndex: number,
  repeat: number,
): PlayableTrack[] {
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
  queue: PlayableTrack[],
  currentIndex: number,
  repeat: number,
): PlayableTrack[] {
  if (!queue.length) {
    return [];
  }

  return [
    ...getUpcomingTracks(queue, currentIndex, repeat),
    ...getPreviousTrack(queue, currentIndex, repeat),
  ];
}

export function getUpcomingTracks(
  queue: PlayableTrack[],
  currentIndex: number,
  repeat: number,
): PlayableTrack[] {
  if (!queue.length || PREFETCH_TRACK_COUNT <= 0) {
    return [];
  }

  const upcoming: PlayableTrack[] = [];
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

function isPreloadable(track: PlayableTrack) {
  return track.type !== MEDIA_TYPE.radioStation && !!track.streamUrlId;
}
