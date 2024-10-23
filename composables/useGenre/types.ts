export interface AlbumsByGenreParams extends Omit<AlbumsParams, 'type'> {}

export interface TracksByGenreParams {
  count?: number;
  genre: string;
  musicFolderId?: string;
  offset?: number;
}

type TypeofRouteMediaTypeParams = typeof ROUTE_MEDIA_TYPE_PARAMS;
export type MediaTypeParam =
  TypeofRouteMediaTypeParams[keyof TypeofRouteMediaTypeParams];

export interface MediaByGenreParams {
  genre: string;
  mediaType?: MediaTypeParam;
  offset?: number;
}
