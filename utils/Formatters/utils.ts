export function formatArtists(media: ResponseAlbum | ResponseSong) {
  const { artist: mediaArtist, artistId, artists } = media;

  if (Array.isArray(artists)) {
    return artists;
  }

  const artist = [];

  if (mediaArtist && artistId) {
    artist.push({
      id: artistId,
      name: mediaArtist,
    });
  }

  return artist;
}

export function formatGenres(
  media: ResponseAlbum | ResponseSong | ResponseEpisode,
) {
  const { genre: mediaGenre, genres } = media;

  if (Array.isArray(genres)) {
    return genres;
  }

  const genre = [];

  if (mediaGenre) {
    genre.push({
      name: mediaGenre,
    });
  }

  return genre;
}

export function getImages(tracks: ResponseSong[] = []) {
  const coverArtIds = tracks.map((track) => track.coverArt);
  return [...new Set(coverArtIds)].splice(0, 4);
}
