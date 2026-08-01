export function usePodcastCleanup() {
  const { deleteBookmark, getBookmarks } = useBookmark();
  const { currentTrack, queueList, removeAllByTrackId } = useQueue();
  const { deletePodcast, deletePodcastEpisode } = usePodcast();

  async function handlePlaybackAfterRemoval(currentTrackWasDeleted: boolean) {
    const {
      isPlaying,
      playCurrentTrackFromQueue,
      resetPlayerSession,
      togglePlay,
    } = useAudioPlayer();

    if (!queueList.value.length) {
      resetPlayerSession();

      return;
    }

    if (currentTrackWasDeleted) {
      // Save state of the isPlaying.
      const currentTrackWasPlaying = isPlaying.value;

      await playCurrentTrackFromQueue();

      if (!currentTrackWasPlaying) {
        await togglePlay();
      }
    }
  }

  async function deletePodcastEpisodeGlobally(podcastEpisode: PodcastEpisode) {
    const currentTrackWasDeleted = currentTrack.value.id === podcastEpisode.id;

    removeAllByTrackId(podcastEpisode.id);
    await deletePodcastEpisode(podcastEpisode);
    await deleteBookmark(podcastEpisode.id, false);
    await handlePlaybackAfterRemoval(currentTrackWasDeleted);
  }

  async function deletePodcastGlobally(podcastId: string) {
    const currentTrackWasDeleted =
      'podcastId' in currentTrack.value &&
      currentTrack.value.podcastId === podcastId;
    const podcastQueueTracks = queueList.value.filter(
      (track): track is PodcastEpisode =>
        'podcastId' in track && track.podcastId === podcastId,
    );

    for (const track of podcastQueueTracks) {
      removeAllByTrackId(track.id);
    }

    await deletePodcast(podcastId);
    await getBookmarks();
    await handlePlaybackAfterRemoval(currentTrackWasDeleted);
  }

  return {
    deletePodcastEpisodeGlobally,
    deletePodcastGlobally,
  };
}
