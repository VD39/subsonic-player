export function useMediaInformation() {
  const { openModal } = useModal();
  const { getPodcast } = usePodcast();
  const { getAlbum } = useAlbum();
  const { addErrorSnack } = useSnack();

  async function openAlbumInformationModal(album: Album) {
    const fullAlbum = await getAlbum(album.id);

    if (!fullAlbum) {
      addErrorSnack(
        'Unable to fetch album information. Please try again later.',
      );

      return;
    }

    openModal(MODAL_TYPE.albumDetailsModal, {
      album: fullAlbum,
    });
  }

  async function openPodcastInformationModal(podcast: Podcast) {
    const fullPodcast = await getPodcast(podcast.id);

    if (!fullPodcast) {
      addErrorSnack(
        'Unable to fetch podcast information. Please try again later.',
      );

      return;
    }

    openModal(MODAL_TYPE.podcastInformationModal, {
      podcast: fullPodcast,
    });
  }

  function openTrackInformationModal(track: MixedTrack) {
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
    openAlbumInformationModal,
    openPodcastInformationModal,
    openTrackInformationModal,
  };
}
