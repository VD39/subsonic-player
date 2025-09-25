import {
  albumMock,
  formattedAlbumMock,
  formattedArtistMock,
  formattedBookmarkMock,
  formattedGenreMock,
  formattedPlaylistMock,
  formattedPodcastEpisodeMock,
  formattedPodcastMock,
  formattedRadioStationMock,
  formattedTrackMock,
  playlistMock,
  podcastEpisodeMock,
  trackMock,
} from './fixtures';

export function getAlbumsMock(
  length = 1,
  params: Partial<AlbumWithSongsID3> = {},
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...albumMock,
      ...params,
      id: `album-${index}`,
    }));
}

export function getFormattedAlbumsMock(
  length = 1,
  params: Partial<Album> = {},
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
  params: Partial<Artist> = {},
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

export function getFormattedBookmarksMock(
  length = 1,
  params: Partial<Bookmark> = {},
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedBookmarkMock,
      ...params,
      id: `track-${index}`,
    }));
}

export function getFormattedGenresMock(
  length = 1,
  params: Partial<Playlist> = {},
) {
  return Array(length)
    .fill('')
    .map(() => ({
      ...formattedGenreMock,
      ...params,
    }));
}

export function getFormattedPlaylistsMock(
  length = 1,
  params: Partial<Playlist> = {},
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

export function getFormattedPodcastEpisodesMock(
  length = 1,
  params: Partial<PodcastEpisode> = {},
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedPodcastEpisodeMock,
      ...params,
      id: `podcast-episode-${index}`,
    }));
}

export function getFormattedPodcastsMock(
  length = 1,
  params: Partial<Podcast> = {},
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedPodcastMock,
      ...params,
      id: `podcast-${index}`,
    }));
}

export function getFormattedQueueTracksMock(
  length = 1,
  params: Partial<MixedTrack> = {},
) {
  return Array(length)
    .fill('')
    .map<MixedTrack>((_, index) => ({
      ...formattedTrackMock,
      ...params,
      id: `queue-${params.type || formattedTrackMock.type}-${index}-id`,
      name: `queue-${params.type || formattedTrackMock.type}-${index}-name`,
      streamUrlId: `queue-streamUrlId${index}`,
    }));
}

export function getFormattedRadioStationMock(
  length = 1,
  params: Partial<RadioStation> = {},
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

export function getFormattedTracksMock(
  length = 1,
  params: Partial<Track> = {},
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...formattedTrackMock,
      ...params,
      id: `track-${index}`,
      image: params.image || `image-${index}`,
      name: `track-${index}`,
    }));
}

export function getPlaylistsMock(
  length = 1,
  params: Partial<PlaylistWithSongs> = {},
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
  params: Partial<ResponsePodcastEpisode> = {},
) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...podcastEpisodeMock,
      ...params,
      id: `podcast-${index}`,
    }));
}

export function getTracksMock(length = 1, params: Partial<Base> = {}) {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      ...trackMock,
      ...params,
      id: `tracks-${index}`,
    }));
}
