import {
  albumMock,
  formattedPlaylistMock,
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
      id: `tracks-${index}`,
      coverArt: params.coverArt || `genre-${index}`,
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
