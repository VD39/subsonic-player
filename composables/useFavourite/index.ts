export function useFavourite() {
  const { fetchData } = useAPI();

  const favourites = useState<AllMedia>(
    STATE_NAMES.favourites,
    () => DEFAULT_ALL_MEDIA,
  );

  async function getFavourites(noLoading = false) {
    const { data: favouritesData } = await fetchData('/getStarred2', {
      params: {
        noLoading,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        formatAllMedia(response.starred2),
    });

    if (favouritesData) {
      favourites.value = favouritesData;
    }
  }

  /* istanbul ignore next -- @preserve */
  async function addFavourite(params: FavouriteParams) {
    await fetchData('/star', {
      method: 'POST',
      params: {
        ...getParams(params),
        noLoading: true,
      },
    });

    getFavourites(true);
  }

  /* istanbul ignore next -- @preserve */
  async function removeFavourite(params: FavouriteParams) {
    await fetchData('/unstar', {
      method: 'POST',
      params: {
        ...getParams(params),
        noLoading: true,
      },
    });

    getFavourites(true);
  }

  return {
    addFavourite,
    favourites,
    getFavourites,
    removeFavourite,
  };
}
