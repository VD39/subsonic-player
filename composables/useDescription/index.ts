export function useDescription() {
  const { openModal } = useModal();

  function openTrackInformationModal(track: Artist | Podcast | QueueTrack) {
    switch (track.type) {
      case MEDIA_TYPE.artist:
        openModal(MODAL_TYPE.artistBiographyModal, {
          description: (track as Artist).biography,
        });
        break;
      case MEDIA_TYPE.podcast:
        openModal(MODAL_TYPE.podcastDescriptionModal, {
          description: (track as Podcast).description,
        });
        break;
      case MEDIA_TYPE.podcastEpisode:
        openModal(MODAL_TYPE.podcastEpisodeDescriptionModal, {
          description: (track as PodcastEpisode).description,
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
