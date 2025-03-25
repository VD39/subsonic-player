export function sortPodcastEpisodes(
  episodes: PodcastEpisode[],
  sortBy: PodcastSortByParam,
) {
  let downloaded = undefined;

  switch (sortBy) {
    case ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded:
      downloaded = true;
      break;
    case ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']:
      downloaded = false;
      break;
    default:
      return episodes;
  }

  return episodes.filter((episode) => episode.downloaded === downloaded);
}

export function sortPodcastsByDate(podcasts: Podcast[]) {
  return podcasts.sort(
    (podcastA, podcastB) =>
      Date.parse(podcastB.lastUpdated) - Date.parse(podcastA.lastUpdated),
  );
}

export function sortPodcastsByName(podcasts: Podcast[]) {
  return podcasts.sort((podcastA, podcastB) =>
    podcastA.name.toLowerCase().localeCompare(podcastB.name.toLowerCase()),
  );
}
