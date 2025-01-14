import {
  albumMock,
  formattedAlbumMock,
  formattedArtistMock,
  formattedPlaylistMock,
  formattedPodcastEpisodeMock,
  formattedRadioStationMock,
  formattedTrackMock,
  playlistMock,
  podcastEpisodeMock,
  trackMock,
} from './fixtures';

export function getTracksMock(length = 1, params = {} as Partial<Base>) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...trackMock,
      ...params,
      coverArt: params.coverArt || `genre-${index}`,
      id: `tracks-${index}`,
    }));
}

export function getAlbumsMock(length = 1, params = {} as Partial<AlbumID3>) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...albumMock,
      ...params,
      id: `album-${index}`,
    }));
}

export function getPlaylistsMock(
  length = 1,
  params = {} as Partial<ResponsePlaylist>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...playlistMock,
      ...params,
      id: `playlist-${index}`,
    }));
}

export function getPodcastEpisodesMock(
  length = 1,
  params = {} as Partial<ResponsePodcastEpisode>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...podcastEpisodeMock,
      ...params,
      id: `podcast-${index}`,
    }));
}

export function getFormattedPlaylistsMock(
  length = 1,
  params = {} as Partial<Playlist>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedPlaylistMock,
      ...params,
      id: `playlist-${index}`,
      name: `playlist-${index}`,
    }));
}

export function getFormattedTracksMock(
  length = 1,
  params = {} as Partial<Track>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedTrackMock,
      ...params,
      id: `track-${index}`,
      name: `track-${index}`,
    }));
}

export function getFormattedAlbumsMock(
  length = 1,
  params = {} as Partial<Album>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedAlbumMock,
      ...params,
      id: `album-${index}`,
      name: `album-${index}`,
    }));
}

export function getFormattedArtistsMock(
  length = 1,
  params = {} as Partial<Artist>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedArtistMock,
      ...params,
      id: `artist-${index}`,
      name: `artist-${index}`,
    }));
}

export function getFormattedRadioStationMock(
  length = 1,
  params = {} as Partial<RadioStation>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedRadioStationMock,
      ...params,
      id: `radio-station-${index}`,
      name: `radio-station-${index}`,
    }));
}

export function getFormattedPodcastEpisodesMock(
  length = 1,
  params = {} as Partial<PodcastEpisode>,
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedPodcastEpisodeMock,
      ...params,
      id: `podcast-${index}`,
    }));
}

export function getFormattedQueueTracksMock(
  length = 1,
  params = {} as Partial<QueueTrack>,
) {
  return Array(length)
    .fill('')
    .map(
      (_, index) =>
        ({
          ...formattedTrackMock,
          ...params,
          id: `queue-${params.type || formattedTrackMock.type}-${index}-id`,
          name: `queue-${params.type || formattedTrackMock.type}-${index}-name`,
          streamUrlId: `queue-streamUrlId${index}`,
        }) as QueueTrack,
    );
}
