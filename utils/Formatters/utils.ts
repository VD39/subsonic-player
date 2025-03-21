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

export function getUniqueImages(tracks: (PodcastEpisode | Track)[] = []) {
  const coverArtIds = tracks.map((track) => track.image);
  const images = [...new Set(coverArtIds)].splice(0, 4);

  if (!images.length) {
    return [IMAGE_DEFAULT_BY_TYPE.playlist];
  }

  return images;
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
    return;
  }

  return new Date(Math.max(...dates));
}

export function getDownloadedEpisodesLength(
  episodes: ResponsePodcastEpisode[] = [],
) {
  return episodes.filter((episode) => episode.status === 'completed').length;
}

export function getUniqueGenres(albums: AlbumID3[] = []): Genre[] {
  const genresNames = albums.flatMap((album) =>
    (album.genres || []).map((genre) => genre.name),
  );

  return [...new Set(genresNames)].map((genre) => ({
    name: genre,
  }));
}

export function getTracksTotal(albums: AlbumID3[] = []) {
  return albums.reduce((sum, album) => sum + album.songCount, 0);
}

export function groupTracksByDiscNumber(tracks: Track[] = []) {
  return tracks.reduce<AlbumTracks>((acc, item) => {
    const discNumber = `Disc ${item.discNumber}`;

    if (!acc[discNumber]) {
      acc[discNumber] = [];
    }

    acc[discNumber].push(item);

    return acc;
  }, {});
}
