export type SortByType =
  | 'random'
  | 'newest'
  | 'frequent'
  | 'recent'
  | 'starred'
  | 'alphabeticalByName'
  | 'alphabeticalByArtist'
  | 'byYear'
  | 'byGenre';

export interface AlbumsParams {
  type: SortByType;
  size?: number;
  offset?: number;
  fromYear?: string;
  toYear?: string;
  genre?: string;
  musicFolderId?: string;
}
