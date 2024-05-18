export function formatGenre(genre: ResponseGenre) {
  return {
    albumCount: genre.albumCount,
    name: genre.name || genre.value,
    songCount: genre.songCount,
  };
}

export function formatTracks(track: Base): Track {
  return {
    album: track.album,
    albumId: track.albumId,
    artists: getArtists(track),
    discNumber: track.discNumber,
    duration: track.duration,
    favourite: !!track.starred,
    genres: getGenres(track),
    id: track.id,
    image: track.coverArt,
    information: {
      bitRate: track.bitRate,
      contentType: track.contentType,
      created: track.created,
      path: track.path,
      playCount: track.playCount,
      suffix: track.suffix,
      transcodedContentType: track.transcodedContentType,
      transcodedSuffix: track.transcodedSuffix,
    },
    size: track.size,
    streamId: track.id,
    title: track.title,
    track: track.track,
    year: track.year,
  };
}

export function formatAlbum(album: AlbumID3 & AlbumWithSongsID3): Album {
  return {
    artists: getArtists(album),
    created: album.id,
    duration: album.duration,
    favourite: !!album.starred,
    genres: getGenres(album as unknown as Base),
    id: album.id,
    image: album.coverArt,
    information: {
      playCount: album.playCount,
    },
    name: album.name,
    size: getAlbumSize(album.song),
    songCount: album.songCount,
    tracks: (album.song || []).map(formatTracks),
    year: album.year,
  };
}

export function formatArtist(
  artistData: Partial<ArtistInfo2 & ArtistWithAlbumsID3>,
): Artist {
  return {
    albums: (artistData.album || []).map(formatAlbum),
    biography: artistData.biography,
    favourite: !!artistData.starred,
    genresList: getUniqueGenres(artistData.album),
    id: artistData.id!,
    image: artistData.coverArt
      ? artistData.coverArt
      : artistData.artistImageUrl,
    lastFmUrl: artistData.lastFmUrl,
    musicBrainzUrl: artistData.musicBrainzId
      ? `https://musicbrainz.org/artist/${artistData.musicBrainzId}`
      : undefined,
    name: artistData.name!,
    totalAlbums: artistData.albumCount || 0,
    totalTracks: getTracksTotal(artistData.album),
  };
}

export function formatPlaylist(playlist: PlaylistWithSongs): Playlist {
  return {
    duration: playlist.duration,
    id: playlist.id,
    images: getUniqueImages(playlist.entry),
    information: {
      changed: playlist.changed,
      comment: playlist.comment,
      created: playlist.created,
      owner: playlist.owner,
      public: playlist.public,
    },
    name: playlist.name || '(Unnamed)',
    songCount: playlist.songCount,
    tracks: (playlist.entry || []).map(formatTracks),
  };
}

export function formatRadioStation(
  station: InternetRadioStation,
): RadioStation {
  const homePageUrl = station.homePageUrl || station.homepageUrl;

  return {
    homePageUrl,
    id: station.id,
    image: homePageUrl
      ? `https://besticon-demo.herokuapp.com/icon?url=${encodeURIComponent(homePageUrl)}&size=80..250..500`
      : 'https://placehold.co/500x500',
    isRadioStation: true,
    name: station.name,
    streamUrl: station.streamUrl,
  };
}

export function formatAllMedia(favourites: Starred2): AllMedia {
  const { artist, album, song } = favourites;

  return {
    albums: (album || []).map(formatAlbum),
    artists: artist || [],
    tracks: (song || []).map(formatTracks),
  };
}

function formatPodcastEpisode(image: string) {
  return function (episode: ResponsePodcastEpisode): PodcastEpisode {
    const downloaded = episode.status === 'completed';

    return {
      channelId: episode.channelId,
      description: episode.description,
      downloaded,
      genres: getGenres(episode),
      image,
      isPodcast: true,
      publishDate: episode.publishDate,
      streamId: downloaded && episode.streamId ? episode.streamId : null,
    };
  };
}

export function formatPodcast(podcast: PodcastChannel): Podcast {
  const { episode = [], originalImageUrl = 'https://placehold.co/500x500' } =
    podcast;

  const lastUpdated = getEarliestDate(episode);
  const downloadedEpisodes = getDownloadedEpisodesLength(episode);

  return {
    description: podcast.description,
    downloadedEpisodes,
    episodes: episode.map(formatPodcastEpisode(originalImageUrl)),
    id: podcast.id,
    image: originalImageUrl,
    lastUpdated,
    title: podcast.title || 'Podcast',
    totalEpisodes: episode.length,
    url: podcast.url,
  };
}
