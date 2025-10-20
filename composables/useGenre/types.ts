export interface AlbumsByGenreParams extends Omit<AlbumsParams, 'type'> {}

export interface MediaByGenreParams {
  genre: string;
  mediaType?: MediaTypeParam;
  offset?: number;
}

export interface TracksByGenreParams {
  count?: number;
  genre: string;
  musicFolderId?: string;
  offset?: number;
}
