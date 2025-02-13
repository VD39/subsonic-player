export function useFavourite() {
  const { fetchData } = useAPI();

  const favourites = useState<AllMedia>(
    STATE_NAMES.favourites,
    () => DEFAULT_ALL_MEDIA,
  );
  const favouriteIds = useState<Record<string, boolean>>(
    STATE_NAMES.favouriteIds,
    () => ({}),
  );

  async function getFavourites() {
    const { data: favouritesData } = await fetchData('/getStarred2', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAllMedia(response.starred2),
    });

    favourites.value = favouritesData || DEFAULT_ALL_MEDIA;
    return favourites;
  }

  /* istanbul ignore next -- @preserve */
  async function addFavourite(params: FavouriteParams) {
    await fetchData('/star', {
      method: 'POST',
      params: getParams(params),
    });

    addToFavouriteIds(params.id!);
    await getFavourites();
  }

  /* istanbul ignore next -- @preserve */
  async function removeFavourite(params: FavouriteParams) {
    await fetchData('/unstar', {
      method: 'POST',
      params: getParams(params),
    });

    addToFavouriteIds(params.id!, false);
    await getFavourites();
  }

  function addToFavouriteIds(id: string, isFavourite = true) {
    favouriteIds.value[id] = isFavourite;
  }

  return {
    addFavourite,
    addToFavouriteIds,
    favouriteIds,
    favourites,
    getFavourites,
    removeFavourite,
  };
}
