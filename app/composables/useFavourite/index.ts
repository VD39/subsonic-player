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

  async function addFavourite(params: FavouriteParams) {
    if (!params.id) {
      return;
    }

    const { error } = await fetchData('/star', {
      method: 'POST',
      query: getFavouriteApiParams(params),
    });

    if (error) {
      return;
    }

    setFavouriteId(params.id);
    getFavourites();
  }

  async function removeFavourite(params: FavouriteParams) {
    if (!params.id) {
      return;
    }

    const { error } = await fetchData('/unstar', {
      method: 'POST',
      query: getFavouriteApiParams(params),
    });

    if (error) {
      return;
    }

    setFavouriteId(params.id, false);
    getFavourites();
  }

  function setFavouriteId(id: string, isFavourite = true) {
    favouriteIds.value[id] = isFavourite;
  }

  function toggleFavourite(
    track: FavouriteParams,
    isCurrentlyFavourite: boolean,
  ) {
    if (!track.id) {
      return;
    }

    if (isCurrentlyFavourite) {
      removeFavourite(track);
    } else {
      addFavourite(track);
    }

    updateTrackFavourite(track.id, !isCurrentlyFavourite);
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
