export function useStateReset() {
  const { resetFavourites } = useFavourite();
  const { resetPlaylists } = usePlaylist();
  const { resetRadioStations } = useRadioStation();
  const { resetBookmarks } = useBookmark();
  const { resetPodcasts } = usePodcast();
  const { resetAlbums } = useAlbum();
  const { resetAudioPlayer } = useAudioPlayer();

  function resetAllUserState() {
    resetAudioPlayer();
    resetFavourites();
    resetPlaylists();
    resetRadioStations();
    resetBookmarks();
    resetPodcasts();
    resetAlbums();
  }

  return {
    resetAllUserState,
  };
}
