export function getArtists(media: AlbumWithSongsID3 | Base): BaseArtist[] {
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

export function getGenres(media: Base): Genre[] {
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

export function getUniqueImages(tracks: Base[] = []) {
  const coverArtIds = tracks.map((track) => track.coverArt!);
  return [...new Set(coverArtIds)].splice(0, 4);
}

export function getRandomTracksDuration(tracks: Base[] = []) {
  return tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
}

export function getAlbumSize(tracks: Base[] = []) {
  return tracks.reduce((sum, track) => sum + (track.size || 0), 0);
}

export function getEarliestDate(episodes: ResponsePodcastEpisode[] = []) {
  const dates = episodes
    .map((episode) => {
      if (!episode.publishDate) {
        return 0;
      }

      return new Date(episode.publishDate).getTime();
    })
    .filter((episode) => episode);

  if (!dates.length) {
    return '';
  }

  const earliestDate = new Date(Math.max(...dates));

  return earliestDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getDownloadedEpisodesLength(
  episodes: ResponsePodcastEpisode[] = [],
) {
  return episodes.filter((episode) => episode.status === 'completed').length;
}

export function getUniqueGenres(albums: AlbumID3[] = []) {
  const genresNames = albums.flatMap((album) =>
    (album.genres || []).map((genre) => genre.name),
  );

  return [...new Set(genresNames)];
}

export function getTracksTotal(albums: AlbumID3[] = []) {
  return albums.reduce((sum, album) => sum + album.songCount, 0);
}
