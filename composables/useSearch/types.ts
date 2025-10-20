export interface SearchParams {
  mediaType: MediaTypeParam;
  offset?: number;
  query: string;
}

export type SearchResultByType = Album | Artist | Track;
