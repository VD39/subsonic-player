export type AlbumSortBy =
  | 'alphabeticalByArtist'
  | 'alphabeticalByName'
  | 'byGenre'
  | 'byYear'
  | 'frequent'
  | 'newest'
  | 'random'
  | 'recent'
  | 'starred';

export interface AlbumsParams {
  fromYear?: string;
  genre?: string;
  musicFolderId?: string;
  offset?: number;
  size?: number;
  toYear?: string;
  type: AlbumSortBy;
}
