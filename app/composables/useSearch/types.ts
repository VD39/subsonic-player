export interface SearchParams {
  loadSize?: number;
  mediaType?: MediaTypeParam;
  offset?: number;
  query: string;
}

export type SearchResultByType = Album | Artist | Track;

export interface SearchSuggestion {
  artists: BaseArtist[];
  icon: Icon;
  id: string;
  name: string;
  route: ToProp;
  track?: Track;
  type: MediaType;
}

export interface SuggestionGroup {
  items: SearchSuggestion[];
  searchType: MediaType;
  title: string;
}
