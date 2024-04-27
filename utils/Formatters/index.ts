export function formatSong(track: ResponseSong): Song {
  return {
    ...track,
    artists: formatArtists(track),
    favourite: !!track.starred,
    genres: formatGenres(track),
    image: track.coverArt,
    streamId: track.id,
  };
}

export function formatPlaylist(playlist: ResponsePlaylist): Playlist {
  return {
    ...playlist,
    entry: undefined,
    image: undefined,
    images: getImages(playlist.entry),
    isReadOnly: false,
    name: playlist.name || '(Unnamed)',
    songs: (playlist.entry || []).map(formatSong),
  };
}
