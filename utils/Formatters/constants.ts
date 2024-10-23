export const MEDIA_TYPE = {
  album: 'album',
  artist: 'artist',
  playlist: 'playlist',
  podcast: 'podcast',
  podcastEpisode: 'podcastEpisode',
  radioStation: 'radioStation',
  track: 'track',
} as const;

export const IMAGE_DEFAULT_BY_TYPE = {
  album: ICONS.album,
  artist: ICONS.artist,
  playlist: ICONS.playlist,
  podcast: ICONS.podcast,
  podcastEpisode: ICONS.podcastEpisode,
  radioStation: ICONS.radioStation,
  track: ICONS.track,
} as Readonly<Record<string, Icon>>;
