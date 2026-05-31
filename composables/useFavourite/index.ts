export function useFavourite() {
  const { fetchData } = useAPI();
  const { updateTrackFavourite } = useQueue();

  const favourites = useState<AllMedia>(
    STATE_KEYS.favourites,
    () => DEFAULT_ALL_MEDIA,
  );
  const favouriteIds = useState<Record<string, boolean>>(
    STATE_KEYS.favouriteIds,
    () => ({}),
  );

  function resetFavourites() {
    favourites.value = DEFAULT_ALL_MEDIA;
    favouriteIds.value = {};
  }

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
      query: getFavouriteApiParams(params),
    });

    setFavouriteId(params.id!);
    getFavourites();
  }

  /* istanbul ignore next -- @preserve */
  async function removeFavourite(params: FavouriteParams) {
    await fetchData('/unstar', {
      method: 'POST',
      query: getFavouriteApiParams(params),
    });

    setFavouriteId(params.id!, false);
    getFavourites();
  }

  function setFavouriteId(id: string, isFavourite = true) {
    favouriteIds.value[id] = isFavourite;
  }

  async function toggleFavourite(
    track: FavouriteParams,
    isCurrentlyFavourite: boolean,
  ) {
    if (isCurrentlyFavourite) {
      await removeFavourite(track);
    } else {
      await addFavourite(track);
    }

    updateTrackFavourite(track.id!, !isCurrentlyFavourite);
  }

  return {
    addFavourite,
    favouriteIds,
    favourites,
    getFavourites,
    removeFavourite,
    resetFavourites,
    setFavouriteId,
    toggleFavourite,
  };
}
