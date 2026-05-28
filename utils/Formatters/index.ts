export function formatAlbum(album: AlbumID3 & AlbumWithSongsID3): Album {
  const {
    coverArt: image = FALLBACK_ICON_BY_TYPE.album,
    created,
    duration,
    id,
    name,
    playCount = 0,
    song = [],
    songCount: trackCount,
    starred,
    year = EMPTY_DISPLAY_VALUE,
  } = album;

  const tracks = song.map((track, index) => formatTrack(track, index));
  const tracksByDiscNumber = groupTracksByDiscNumber(tracks);

  return {
    artists: getArtists(album),
    created: formatDate(created),
    duration,
    favourite: !!starred,
    formattedDuration: secondsToHHMMSS(duration),
    genres: getGenres(album as unknown as Base),
    id,
    image,
    information: {
      playCount,
    },
    name,
    size: formatFileSize(getAlbumSize(song)),
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
    tracks: song.map((track, index) => formatTrack(track, index)),
  };
}

export function formatAppInformation(subsonicResponse: SubsonicResponse) {
  const { openSubsonic, type, version } = subsonicResponse;

  return {
    name: type,
    openSubsonic: openSubsonic ? 'Yes' : 'No',
    version,
  };
}

export function formatArtist(
  artistData: Partial<
    { similarSongs: SimilarSongs2['song'] } & {
      topSongs: TopSongs['song'];
    } & ArtistInfo2 &
      ArtistWithAlbumsID3
  >,
): Artist {
  const {
    album = [],
    albumCount: totalAlbums = 0,
    artistImageUrl = FALLBACK_ICON_BY_TYPE.artist,
    biography,
    coverArt,
    id,
    lastFmUrl,
    musicBrainzId,
    name = EMPTY_DISPLAY_VALUE,
    similarArtist = [],
    similarSongs = [],
    starred,
    topSongs = [],
  } = artistData;

  return {
    albums: album.map(formatAlbum),
    biography,
    favourite: !!starred,
    genres: getUniqueGenres(album),
    id: id!,
    image: coverArt || artistImageUrl || FALLBACK_ICON_BY_TYPE.artist,
    lastFmUrl,
    musicBrainzUrl: musicBrainzId
      ? `https://musicbrainz.org/artist/${musicBrainzId}`
      : undefined,
    name,
    similarArtists: similarArtist.map(formatArtist),
    similarTracks: similarSongs.map((track, index) =>
      formatTrack(track, index),
    ),
    topTracks: topSongs.map((track, index) => formatTrack(track, index)),
    totalAlbums,
    totalTracks: getTotalTracks(album),
    type: MEDIA_TYPE.artist,
  };
}

export function formatBookmark(bookmark: FormattedBookmark): Bookmark {
  const positionSeconds = Math.floor((bookmark.position || 0) / 1000);

  return {
    ...formatPodcastEpisode(bookmark as unknown as ResponsePodcastEpisode),
    formattedPosition: secondsToHHMMSS(positionSeconds),
    position: positionSeconds,
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

export function formatMusicFolder(
  folder: ResponseMusicFolder,
): FormattedMusicFolder {
  return {
    ...folder,
    image: FALLBACK_ICON_BY_TYPE.folder,
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
    owner = EMPTY_DISPLAY_VALUE,
    public: playlistPublic = false,
    songCount: trackCount,
  } = playlist;

  const tracks = formatMixedEntries(entry);

  return {
    duration,
    formattedDuration: secondsToHumanReadable(duration),
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

export function formatPlayQueue(playQueue: PlayQueue): FormattedPlayQueue {
  const { current, entry = [], position = 0 } = playQueue;

  const tracks = formatMixedEntries(entry);

  return {
    current,
    position,
    tracks,
  };
}

export function formatPodcast(podcast: PodcastChannel): Podcast {
  const {
    coverArt = FALLBACK_ICON_BY_TYPE.podcast,
    description,
    episode = [],
    id,
    originalImageUrl,
    title: name = 'Podcast',
    url,
  } = podcast;

  const podcastEpisodes = episode.map(formatPodcastEpisode);
  const episodes = getPodcastEpisodesByDownloadStatus(podcastEpisodes);

  return {
    description,
    episodes,
    id,
    image: originalImageUrl || coverArt,
    lastUpdated: formatDate(getLatestDate(episode)),
    name,
    totalDownloadedEpisodes: getDownloadedEpisodesCount(episode),
    totalEpisodes: episode.length,
    type: MEDIA_TYPE.podcast,
    url,
  };
}

export function formatPodcastEpisode(
  episode: ResponsePodcastEpisode,
): PodcastEpisode {
  const {
    album = EMPTY_DISPLAY_VALUE,
    artist: author = EMPTY_DISPLAY_VALUE,
    channelId: podcastId,
    coverArt: image = FALLBACK_ICON_BY_TYPE.podcastEpisode,
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
    duration: duration!,
    formattedDuration: secondsToHHMMSS(duration),
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
    : FALLBACK_ICON_BY_TYPE.radioStation;

  return {
    duration: 0,
    formattedDuration: '',
    homePageUrl: radioStationHomePageUrl || radioStationHomepageUrl,
    id,
    image,
    name,
    streamUrlId: streamUrl,
    trackNumber: 0,
    type: MEDIA_TYPE.radioStation,
  };
}

export function formatTrack(track: Base, index: number): Track {
  const {
    album = EMPTY_DISPLAY_VALUE,
    albumId,
    bitRate = 0,
    contentType = EMPTY_DISPLAY_VALUE,
    coverArt: image = FALLBACK_ICON_BY_TYPE.track,
    created,
    discNumber = EMPTY_DISPLAY_VALUE,
    duration,
    id,
    parent,
    path = EMPTY_DISPLAY_VALUE,
    playCount = 0,
    size = 0,
    starred,
    suffix = EMPTY_DISPLAY_VALUE,
    title: name,
    track: trackNumber = EMPTY_DISPLAY_VALUE,
    transcodedContentType = EMPTY_DISPLAY_VALUE,
    transcodedSuffix = EMPTY_DISPLAY_VALUE,
    year = EMPTY_DISPLAY_VALUE,
  } = track;

  return {
    album,
    albumId: albumId || parent,
    artists: getArtists(track),
    discNumber,
    duration: duration!,
    favourite: !!starred,
    formattedDuration: secondsToHHMMSS(duration),
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
    size: formatFileSize(size),
    streamUrlId: id,
    trackNumber,
    type: MEDIA_TYPE.track,
    year,
  };
}

function formatMixedEntries(entries: Base[]): (PodcastEpisode | Track)[] {
  return entries.map((entry, index) =>
    entry.type === 'podcastepisode'
      ? formatPodcastEpisode(entry as ResponsePodcastEpisode)
      : formatTrack(entry, index),
  );
}
