export function useStateReset() {
  const { resetFavourites } = useFavourite();
  const { resetPlaylists } = usePlaylist();
  const { resetRadioStations } = useRadioStation();
  const { resetBookmarks } = useBookmark();
  const { resetPodcasts } = usePodcast();
  const { resetAlbums } = useAlbum();
  const { resetAudioPlayer } = useAudioPlayer();
  const { resetQueue } = useQueue();

  function resetAllUserState() {
    resetAlbums();
    resetAudioPlayer();
    resetBookmarks();
    resetFavourites();
    resetPlaylists();
    resetPodcasts();
    resetQueue(false);
    resetRadioStations();
  }

  return {
    resetAllUserState,
  };
}
