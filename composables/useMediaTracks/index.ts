export function useMediaTracks() {
  const { getAlbum } = useAlbum();
  const { getPodcast } = usePodcast();

  async function getMediaTracks(media: MixedMediaAndTrack) {
    switch (media.type) {
      case MEDIA_TYPE.album: {
        const album = media as Album;

        if (album.tracks.length) {
          return album.tracks;
        }

        const selectedAlbum = await getAlbum(media.id);

        if (!selectedAlbum?.tracks) {
          return null;
        }

        return selectedAlbum.tracks;
      }
      case MEDIA_TYPE.playlist:
        return (media as Playlist).tracks;
      case MEDIA_TYPE.podcast: {
        const selectedPodcast = await getPodcast(media.id);

        if (!selectedPodcast?.episodes?.downloaded) {
          return null;
        }

        return selectedPodcast.episodes.downloaded;
      }
      case MEDIA_TYPE.podcastEpisode:
      case MEDIA_TYPE.track:
        return [media as MixedTrack];
      default:
        return null;
    }
  }

  return {
    getMediaTracks,
  };
}
