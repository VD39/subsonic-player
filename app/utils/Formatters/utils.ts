export function filterPodcastEpisodesByStatus(
  podcastEpisodes: PodcastEpisode[],
  sortBy: PodcastSortByParam,
) {
  let downloaded = undefined;

  switch (sortBy) {
    case ROUTE_PODCAST_FILTER_PARAMS.Downloaded:
      downloaded = true;
      break;
    case ROUTE_PODCAST_FILTER_PARAMS['Not downloaded']:
      downloaded = false;
      break;
    default:
      return podcastEpisodes;
  }

  return podcastEpisodes.filter(
    (podcastEpisode) => podcastEpisode.downloaded === downloaded,
  );
}

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

export function getDownloadedPodcastEpisodesCount(
  podcastEpisodes: ResponsePodcastEpisode[] = [],
) {
  return podcastEpisodes.filter(
    (podcastEpisode) => podcastEpisode.status === 'completed',
  ).length;
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

export function getLatestDate(podcastEpisodes: ResponsePodcastEpisode[] = []) {
  const dates = podcastEpisodes
    .map((podcastEpisode) => {
      if (!podcastEpisode.publishDate) {
        return 0;
      }

      return new Date(podcastEpisode.publishDate).getTime();
    })
    .filter(Boolean);

  if (!dates.length) {
    return;
  }

  return new Date(Math.max(...dates));
}

export function getPodcastEpisodesByDownloadStatus(
  podcastEpisodes: PodcastEpisode[] = [],
) {
  return {
    [ROUTE_PODCAST_FILTER_PARAMS.All]: podcastEpisodes,
    [ROUTE_PODCAST_FILTER_PARAMS.Downloaded]: filterPodcastEpisodesByStatus(
      podcastEpisodes,
      ROUTE_PODCAST_FILTER_PARAMS.Downloaded,
    ),
    [ROUTE_PODCAST_FILTER_PARAMS['Not downloaded']]:
      filterPodcastEpisodesByStatus(
        podcastEpisodes,
        ROUTE_PODCAST_FILTER_PARAMS['Not downloaded'],
      ),
  };
}

export function getReplayGain(track: Base) {
  const { peakValue, replayGain } = track;

  const gainData = typeof replayGain === 'object' ? replayGain : undefined;
  const flatGain = typeof replayGain === 'number' ? replayGain : undefined;

  return {
    peak: gainData?.trackPeak ?? peakValue,
    peakAlbum: gainData?.albumPeak,
    replayGain: gainData?.trackGain ?? flatGain,
    replayGainAlbum: gainData?.albumGain,
  };
}

export function getTotalTracks(albums: AlbumWithSongsID3[] = []) {
  return albums.reduce((sum, album) => sum + album.songCount, 0);
}

export function getTotalTracksDuration(tracks: Base[] = []) {
  return tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
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
    return [FALLBACK_ICON_BY_TYPE.playlist];
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
