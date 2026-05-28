export function getPreviousTracks(
  queue: PlayableTrack[],
  currentIndex: number,
  repeat: number,
): PlayableTrack[] {
  if (!queue.length || (currentIndex <= 0 && repeat !== REPEAT_MODE.all)) {
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
    ...getPreviousTracks(queue, currentIndex, repeat),
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
    if (index >= totalTracks && repeat !== REPEAT_MODE.all) {
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

function isPreloadable(track: PlayableTrack) {
  return track.type !== MEDIA_TYPE.radioStation && !!track.streamUrlId;
}
