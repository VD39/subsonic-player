export function formatGenre(genre: ResponseGenre): Genre {
  const { albumCount, name, songCount: trackCount, value } = genre;

  return {
    albumCount,
    name: name || value,
    trackCount,
  };
}

export function formatTracks(track: Base): Track {
  const {
    album = DEFAULT_VALUE,
    albumId,
    bitRate = 0,
    contentType = DEFAULT_VALUE,
    coverArt: image = IMAGE_DEFAULT_BY_TYPE.track,
    created,
    discNumber = DEFAULT_VALUE,
    duration,
    id,
    parent,
    path = DEFAULT_VALUE,
    playCount = 0,
    size = 0,
    starred,
    suffix = DEFAULT_VALUE,
    title: name,
    track: trackNumber = DEFAULT_VALUE,
    transcodedContentType = DEFAULT_VALUE,
    transcodedSuffix = DEFAULT_VALUE,
    year = DEFAULT_VALUE,
  } = track;

  return {
    album,
    albumId: albumId || parent,
    artists: getArtists(track),
    discNumber,
    duration: secondsToHHMMSS(duration),
    favourite: !!starred,
    genres: getGenres(track),
    id,
    image,
    information: {
      bitRate: `${bitRate} kbps`,
      contentType,
      created: formatDate(created),
      path,
      playCount,
      suffix,
      transcodedContentType,
      transcodedSuffix,
    },
    name,
    size: bytesToMB(size),
    streamUrlId: id,
    trackNumber,
    type: MEDIA_TYPE.track,
    year,
  };
}

export function formatAlbum(album: AlbumID3 & AlbumWithSongsID3): Album {
  const {
    coverArt: image = IMAGE_DEFAULT_BY_TYPE.album,
    created,
    duration,
    id,
    name,
    playCount = 0,
    song = [],
    songCount: trackCount,
    starred,
    year = DEFAULT_VALUE,
  } = album;

  return {
    artists: getArtists(album),
    created: formatDate(created),
    duration: secondsToHHMMSS(duration),
    favourite: !!starred,
    genres: getGenres(album as unknown as Base),
    id,
    image,
    information: {
      playCount,
    },
    name,
    size: bytesToMB(getAlbumSize(song)),
    trackCount,
    tracks: song.map(formatTracks),
    type: MEDIA_TYPE.album,
    year,
  };
}

function formatSimilarArtist(similarArtist: ArtistID3): SimilarArtist {
  const { coverArt = IMAGE_DEFAULT_BY_TYPE.artist, id, name } = similarArtist;

  return {
    id,
    image: coverArt,
    name,
  };
}

export function formatArtist(
  artistData: Partial<ArtistInfo2 & ArtistWithAlbumsID3>,
): Artist {
  const {
    album = [],
    albumCount: totalAlbums = 0,
    artistImageUrl,
    biography,
    coverArt = IMAGE_DEFAULT_BY_TYPE.artist,
    id,
    lastFmUrl,
    musicBrainzId,
    name = DEFAULT_VALUE,
    similarArtist = [],
    starred,
  } = artistData;

  const image = artistImageUrl || coverArt;
  const musicBrainzUrl = musicBrainzId
    ? `https://musicbrainz.org/artist/${musicBrainzId}`
    : undefined;

  return {
    albums: album.map(formatAlbum),
    biography,
    favourite: !!starred,
    genres: getUniqueGenres(album),
    id: id!,
    image,
    lastFmUrl,
    musicBrainzUrl,
    name,
    similarArtist: similarArtist.map(formatSimilarArtist),
    totalAlbums,
    totalTracks: getTracksTotal(album),
    type: MEDIA_TYPE.artist,
  };
}

export function formatPlaylist(playlist: PlaylistWithSongs): Playlist {
  const {
    changed,
    comment,
    created,
    duration,
    entry = [],
    id,
    name: playlistName,
    owner = DEFAULT_VALUE,
    public: playlistPublic = false,
    songCount: trackCount,
  } = playlist;

  const name = playlistName || '(Unnamed)';

  return {
    duration: secondsToTimeFormat(duration),
    id,
    images: getUniqueImages(entry),
    information: {
      changed: formatDate(changed),
      comment,
      created: formatDate(created),
      owner,
      public: playlistPublic,
    },
    name,
    trackCount,
    tracks: entry.map(formatTracks),
    type: MEDIA_TYPE.playlist,
  };
}

export function formatRadioStation(
  station: InternetRadioStation,
): RadioStation {
  const {
    homePageUrl: radioStationHomePageUrl,
    homepageUrl: radioStationHomepageUrl,
    id,
    name,
    streamUrl,
  } = station;

  const homePageUrl = radioStationHomePageUrl || radioStationHomepageUrl;

  // TODO: Fix this to use app is running.
  // const image = homePageUrl
  //   ? `https://besticon-demo.herokuapp.com/icon?url=${encodeURIComponent(homePageUrl)}&size=80..250..500`
  //   : IMAGE_DEFAULT_BY_TYPE.radioStation;

  return {
    duration: '',
    homePageUrl,
    id,
    image: IMAGE_DEFAULT_BY_TYPE.radioStation,
    name,
    streamUrlId: streamUrl,
    type: MEDIA_TYPE.radioStation,
  };
}

export function formatAllMedia(favourites: Starred2): AllMedia {
  const { album = [], artist = [], song = [] } = favourites;

  return {
    albums: album.map(formatAlbum),
    artists: artist.map(formatArtist),
    tracks: song.map(formatTracks),
  };
}

export function formatPodcastEpisode(podcast: Partial<Podcast>) {
  const { image: podcastImage, name: podcastName } = podcast;

  return function (episode: ResponsePodcastEpisode): PodcastEpisode {
    const {
      album = DEFAULT_VALUE,
      artist: author = DEFAULT_VALUE,
      channelId: podcastId,
      coverArt = IMAGE_DEFAULT_BY_TYPE.podcastEpisode,
      description,
      duration,
      id,
      publishDate,
      status,
      streamId,
      title: name,
    } = episode;

    const downloaded = status === 'completed';
    const image = podcastImage || coverArt;
    const streamUrlId = downloaded && streamId ? streamId : undefined;

    return {
      author,
      description,
      downloaded,
      duration: secondsToHHMMSS(duration),
      genres: getGenres(episode),
      id,
      image,
      name,
      podcastId,
      podcastName: podcastName! || album,
      publishDate: formatDate(publishDate, {}),
      streamUrlId,
      type: MEDIA_TYPE.podcastEpisode,
    };
  };
}

export function formatPodcast(podcast: PodcastChannel): Podcast {
  const {
    coverArt = IMAGE_DEFAULT_BY_TYPE.podcast,
    description,
    episode = [],
    id,
    originalImageUrl,
    title: name = 'Podcast',
    url,
  } = podcast;

  const lastUpdated = formatDate(getEarliestDate(episode));
  const totalDownloadedEpisodes = getDownloadedEpisodesLength(episode);
  const image = originalImageUrl || coverArt;
  const totalEpisodes = episode.length;

  return {
    description,
    episodes: episode.map(
      formatPodcastEpisode({
        image,
        name,
      }),
    ),
    id,
    image,
    lastUpdated,
    name,
    totalDownloadedEpisodes,
    totalEpisodes,
    type: MEDIA_TYPE.podcast,
    url,
  };
}
