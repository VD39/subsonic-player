export function sortPodcastsByName(podcasts: Podcast[]) {
  return podcasts.sort((podcastA, podcastB) =>
    podcastA.name.toLowerCase().localeCompare(podcastB.name.toLowerCase()),
  );
}
