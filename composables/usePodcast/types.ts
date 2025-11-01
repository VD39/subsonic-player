export type PodcastSortByParam =
  TypeofPodcastRouteSortBy[keyof TypeofPodcastRouteSortBy];

export interface PodcastsParams {
  id?: string;
  includeEpisodes?: boolean;
}

export type PodcastState = Record<string, null | Podcast>;

export type TypeofPodcastRouteSortBy = typeof ROUTE_PODCAST_SORT_BY_PARAMS;
