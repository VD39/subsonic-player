export function getParams(params: FavouriteParams) {
  const { id, type } = params;

  return {
    albumId: type === 'album' ? id : undefined,
    artistId: type === 'artist' ? id : undefined,
    id: type === 'track' ? id : undefined,
  };
}
