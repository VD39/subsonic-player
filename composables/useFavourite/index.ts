export function useFavourite() {
  const { fetchData } = useAPI();

  const favourites = useState<AllMedia>('favourites', () => DEFAULT_ALL_MEDIA);

  async function getFavourites() {
    const { data: favouritesData } = await fetchData('/getStarred2', {
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
  }

  return {
    addFavourite,
    favourites,
    getFavourites,
    removeFavourite,
  };
}
