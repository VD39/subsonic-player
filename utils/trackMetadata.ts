export function getTrackDisplayMetadata(track: MixedTrack) {
  switch (track.type) {
    case MEDIA_TYPE.podcastEpisode:
      return {
        album: (track as PodcastEpisode).podcastName,
        artist: (track as PodcastEpisode).author,
        title: track.name,
      };
    case MEDIA_TYPE.track:
      return {
        album: (track as Track).album,
        artist: formatListToString(
          (track as Track).artists.map((artist) => artist.name),
        ),
        title: track.name,
      };
    default:
      return {
        album: '',
        artist: '',
        title: track.name,
      };
  }
}
