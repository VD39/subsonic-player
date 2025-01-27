export function useFavourite() {
  const { fetchData } = useAPI();

  async function getFavourites() {
    const { data: favouritesData } = await fetchData('/getStarred2', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAllMedia(response.starred2),
    });

    return favouritesData || DEFAULT_ALL_MEDIA;
  }

  /* istanbul ignore next -- @preserve */
  async function addFavourite(params: FavouriteParams) {
    await fetchData('/star', {
      method: 'POST',
      params: getParams(params),
    });
  }

  /* istanbul ignore next -- @preserve */
  async function removeFavourite(params: FavouriteParams) {
    await fetchData('/unstar', {
      method: 'POST',
      params: getParams(params),
    });
  }

  return {
    addFavourite,
    getFavourites,
    removeFavourite,
  };
}
