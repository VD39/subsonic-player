export type PodcastSortByParam =
  TypeofPodcastRouteSortBy[keyof TypeofPodcastRouteSortBy];
export type PodcastsSortByParam =
  TypeofPodcastsRouteSortBy[keyof TypeofPodcastsRouteSortBy];

type TypeofPodcastRouteSortBy = typeof ROUTE_PODCAST_SORT_BY_PARAMS;
type TypeofPodcastsRouteSortBy = typeof ROUTE_PODCASTS_SORT_BY_PARAMS;
