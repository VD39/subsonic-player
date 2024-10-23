export function getParams(params: FavouriteParams) {
  const { id, type } = params;

  return {
    albumId: type === MEDIA_TYPE.album ? id : undefined,
    artistId: type === MEDIA_TYPE.artist ? id : undefined,
    id: type === MEDIA_TYPE.track ? id : undefined,
  };
}
