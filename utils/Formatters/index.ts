export function formatAlbum(album: AlbumWithSongsID3): Album {
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

  const tracks = song.map(formatTracks);
  const tracksByDiscNumber = groupTracksByDiscNumber(tracks);

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
    totalDiscNumber: Object.keys(tracksByDiscNumber).length,
    trackCount,
    tracks,
    tracksByDiscNumber,
    type: MEDIA_TYPE.album,
    year,
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

export function formatArtist(
  artistData: Partial<ArtistInfo2 & ArtistWithAlbumsID3>,
): Artist {
  const {
    album = [],
    albumCount: totalAlbums = 0,
    artistImageUrl = IMAGE_DEFAULT_BY_TYPE.artist,
    biography,
    coverArt,
    id,
    lastFmUrl,
    musicBrainzId,
    name = DEFAULT_VALUE,
    similarArtist = [],
    starred,
  } = artistData;

  return {
    albums: album.map(formatAlbum),
    biography,
    favourite: !!starred,
    genres: getUniqueGenres(album),
    id: id!,
    image: coverArt || artistImageUrl,
    lastFmUrl,
    musicBrainzUrl: musicBrainzId
      ? `https://musicbrainz.org/artist/${musicBrainzId}`
      : undefined,
    name,
    similarArtist: similarArtist.map(formatSimilarArtist),
    totalAlbums,
    totalTracks: getTracksTotal(album),
    type: MEDIA_TYPE.artist,
  };
}

export function formatBookmark(bookmark: FormattedBookmark): Bookmark {
  const rawPosition = (bookmark.position || 0) / 1000;

  return {
    ...formatPodcastEpisode(bookmark as unknown as ResponsePodcastEpisode),
    position: secondsToHHMMSS(rawPosition),
    rawPosition,
    trackNumber: 0,
  };
}

export function formatGenre(genre: ResponseGenre): Genre {
  const { albumCount, name, songCount: trackCount, value } = genre;

  return {
    albumCount,
    name: name || value,
    trackCount,
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
    name = '(Unnamed)',
    owner = DEFAULT_VALUE,
    public: playlistPublic = false,
    songCount: trackCount,
  } = playlist;

  const tracks = entry.map((media, index) =>
    media.type === 'podcastepisode'
      ? formatPodcastEpisode(media as ResponsePodcastEpisode)
      : formatTracks(media, index),
  );

  return {
    duration: secondsToTimeFormat(duration),
    id,
    images: getUniqueImages(tracks),
    information: {
      changed: formatDate(changed),
      comment,
      created: formatDate(created),
      owner,
      public: playlistPublic,
    },
    name,
    trackCount,
    tracks,
    type: MEDIA_TYPE.playlist,
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

  const podcastEpisodes = episode.map(formatPodcastEpisode);
  const episodes = getSortedPodcastEpisodes(podcastEpisodes);

  return {
    description,
    episodes,
    id,
    image: originalImageUrl || coverArt,
    lastUpdated: formatDate(getEarliestDate(episode)),
    name,
    totalDownloadedEpisodes: getDownloadedEpisodesLength(episode),
    totalEpisodes: episode.length,
    type: MEDIA_TYPE.podcast,
    url,
  };
}

export function formatPodcastEpisode(
  episode: ResponsePodcastEpisode,
): PodcastEpisode {
  const {
    album = DEFAULT_VALUE,
    artist: author = DEFAULT_VALUE,
    channelId: podcastId,
    coverArt: image = IMAGE_DEFAULT_BY_TYPE.podcastEpisode,
    description,
    duration,
    id,
    parent,
    publishDate,
    status,
    streamId,
    title: name,
  } = episode;

  return {
    author,
    description,
    downloaded: status === 'completed',
    duration: secondsToHHMMSS(duration),
    genres: getGenres(episode),
    id,
    image,
    name,
    podcastId: parent || podcastId,
    podcastName: album,
    publishDate: formatDate(publishDate, {}),
    streamUrlId: streamId || id,
    trackNumber: 0,
    type: MEDIA_TYPE.podcastEpisode,
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
  const image = homePageUrl
    ? `https://s2.googleusercontent.com/s2/favicons?domain=${encodeURIComponent(homePageUrl)}&sz=50`
    : IMAGE_DEFAULT_BY_TYPE.radioStation;

  return {
    duration: '',
    homePageUrl: radioStationHomePageUrl || radioStationHomepageUrl,
    id,
    image,
    name,
    streamUrlId: streamUrl,
    trackNumber: 0,
    type: MEDIA_TYPE.radioStation,
  };
}

export function formatTracks(track: Base, index: number): Track {
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
    index,
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

function formatSimilarArtist(similarArtist: ArtistID3): SimilarArtist {
  const { coverArt = IMAGE_DEFAULT_BY_TYPE.artist, id, name } = similarArtist;

  return {
    id,
    image: coverArt,
    name,
  };
}
