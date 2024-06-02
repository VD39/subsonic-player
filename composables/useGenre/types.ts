export interface AlbumsByGenreParams extends Omit<AlbumsParams, 'type'> {}

export interface TracksByGenreParams {
  genre: string;
  count?: number;
  offset?: number;
  musicFolderId?: string;
}

export interface MediaByGenreParams {
  mediaType?: string;
  genre: string;
  offset?: number;
}
