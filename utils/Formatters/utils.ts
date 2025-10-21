export function getAlbumSize(tracks: Base[] = []) {
  return tracks.reduce((sum, track) => sum + (track.size || 0), 0);
}

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

export function getDownloadedEpisodesLength(
  episodes: ResponsePodcastEpisode[] = [],
) {
  return episodes.filter((episode) => episode.status === 'completed').length;
}

export function getEarliestDate(episodes: ResponsePodcastEpisode[] = []) {
  const dates = episodes
    .map((episode) => {
      if (!episode.publishDate) {
        return 0;
      }

      return new Date(episode.publishDate).getTime();
    })
    .filter(Boolean);

  if (!dates.length) {
    return;
  }

  return new Date(Math.max(...dates));
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

export function getRandomTracksDuration(tracks: Base[] = []) {
  return tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
}

export function getSortedPodcastEpisodes(
  podcastEpisodes: PodcastEpisode[] = [],
) {
  return {
    [ROUTE_PODCAST_SORT_BY_PARAMS.All]: podcastEpisodes,
    [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded]: sortPodcastEpisodes(
      podcastEpisodes,
      ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded,
    ),
    [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']]: sortPodcastEpisodes(
      podcastEpisodes,
      ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded'],
    ),
  };
}

export function getTracksTotal(albums: AlbumWithSongsID3[] = []) {
  return albums.reduce((sum, album) => sum + album.songCount, 0);
}

export function getUniqueGenres(albums: AlbumWithSongsID3[] = []): Genre[] {
  const genresNames = albums.flatMap((album) =>
    (album.genres || []).map((genre) => genre.name),
  );

  return [...new Set(genresNames)].map((genre) => ({
    name: genre,
  }));
}

export function getUniqueImages(tracks: (PodcastEpisode | Track)[] = []) {
  const coverArtIds = tracks.map((track) => track.image);
  const images = [...new Set(coverArtIds)].slice(0, 4);

  if (!images.length) {
    return [IMAGE_DEFAULT_BY_TYPE.playlist];
  }

  return images;
}

export function groupTracksByDiscNumber(tracks: Track[] = []) {
  return tracks.reduce<TracksByDiscNumber>((previousValue, item, index) => {
    const discNumber = `Disc ${item.discNumber}`;

    if (!previousValue[discNumber]) {
      previousValue[discNumber] = [];
    }

    previousValue[discNumber].push({
      ...item,
      index,
    });

    return previousValue;
  }, {});
}

export function sortPodcastEpisodes(
  episodes: PodcastEpisode[],
  sortBy: PodcastSortByParam,
) {
  let downloaded = undefined;

  switch (sortBy) {
    case ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded:
      downloaded = true;
      break;
    case ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded']:
      downloaded = false;
      break;
    default:
      return episodes;
  }

  return episodes.filter((episode) => episode.downloaded === downloaded);
}
