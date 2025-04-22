export function useMediaInformation() {
  const { openModal } = useModal();

  function openTrackInformationModal(track: Artist | MixedTrack | Podcast) {
    switch (track.type) {
      case MEDIA_TYPE.podcastEpisode:
        openModal(MODAL_TYPE.podcastEpisodeInformationModal, {
          podcastEpisode: track,
        });
        break;
      case MEDIA_TYPE.track:
        openModal(MODAL_TYPE.trackDetailsModal, {
          track,
        });
        break;
    }
  }

  return {
    openTrackInformationModal,
  };
}
