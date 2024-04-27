export interface ResponseArtist {
  id: string;
  name: string;
  albumCount?: number;
  starred?: string;
  coverArt?: string;
  album?: ResponseAlbum[];
}

export interface ResponseArtistInfo2 {
  biography: string;
  musicBrainzId: string;
  lastFmUrl: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
  artistImageUrl: string;
  similarArtist: ResponseArtist[];
}

export interface Index {
  name: string;
  artist: ResponseArtist[];
}

export interface ResponseArtists {
  ignoredArticles: string;
  index: Index[];
}

export interface ResponseGenre {
  name: string;
  value?: string;
  songCount?: number;
  albumCount?: number;
}

export interface ReplayGain {
  trackPeak: number;
  albumPeak: number;
}

export interface ResponseAlbumArtist {
  id: string;
  name: string;
}

export interface ResponseAlbum {
  id: string;
  created: string;
  artistId: string;
  artist: string;
  artists: ResponseArtist[];
  displayArtist: string;
  title: string;
  album: string;
  coverArt?: string;
  name?: string;
  songCount: number;
  duration: number;
  playCount: number;
  year?: number;
  starred?: string;
  genre?: string;
  genres?: ResponseGenre[];
  song?: ResponseSong[];
}

export interface ResponseSong {
  id: string;
  album: string;
  albumId?: string;
  artist: string;
  artistId?: string;
  artists: ResponseArtist[] | null;
  displayArtist: string;
  albumArtists: ResponseAlbumArtist[] | null;
  displayAlbumArtist: string;
  bitRate: number;
  contentType: string;
  coverArt: string;
  created: string;
  duration: number;
  isDir: boolean;
  isVideo: boolean;
  parent: string;
  path: string;
  size: number;
  suffix: string;
  title: string;
  track: number;
  discNumber: number;
  type: string;
  year: number;
  musicBrainzId: string;
  starred?: string;
  genre?: string;
  playCount?: number;
  userRating?: number;
  bookmarkPosition?: number;
  played?: string;
  bpm?: number;
  comment?: string;
  sortName?: string;
  mediaType?: string;
  genres?: ResponseGenre[] | null;
  replayGain?: ReplayGain | null;
}

export interface ResponseAlbumList2 {
  album: ResponseAlbum[];
}

interface ResponseGenres {
  genre: ResponseGenre[];
}

export interface ResponseSongs {
  song: ResponseSong[];
}

export interface ResponsePlaylist {
  id: string;
  name: string;
  comment: string;
  owner: string;
  songCount: number;
  created: string;
  changed: string;
  duration: number;
  public?: boolean;
  entry?: ResponseSong[];
}

export interface ResponsePlaylists {
  playlist: ResponsePlaylist[];
}

export interface ResponseEpisode {
  id: string;
  streamId: string;
  channelId: string;
  title: string;
  description: string;
  publishDate: string;
  status: string;
  parent: string;
  isDir: boolean;
  year: number;
  genre?: string;
  genres?: ResponseGenre[];
  coverArt: string;
  size: number;
  contentType: string;
  suffix: string;
  duration: number;
  bitrate: number;
  path: string;
}

export interface ResponseChannel {
  id: string;
  url: string;
  title: string;
  description: string;
  coverArt: string;
  originalImageUrl: string;
  status: string;
  episode: ResponseEpisode[];
  date: string;
}

interface ResponsePodcasts {
  channel: ResponseChannel[];
}

export interface ResponseInternetRadioStation {
  id: string;
  name: string;
  streamUrl: string;
  homepageUrl: string;
}

export interface ResponseInternetRadioStations {
  internetRadioStation: ResponseInternetRadioStation[];
}
export interface ResponseAllMedia {
  artist?: ResponseArtist[];
  album?: ResponseAlbum[];
  song?: ResponseSong[];
}

export interface SubsonicResponse {
  status: string;
  version: string;
  type: string;
  serverVersion: string;
  openSubsonic: boolean;
  // Favourites
  starred2: ResponseAllMedia;
  // Genre
  genres: ResponseGenres;
  songsByGenre: ResponseSongs;
  // Music
  artists: ResponseArtists;
  artist: ResponseArtist;
  artistInfo2: ResponseArtistInfo2;
  album: ResponseAlbum;
  topSongs: ResponseSongs;
  // Genre and Music
  albumList2: ResponseAlbumList2;
  // Playlists
  playlist: ResponsePlaylist;
  playlists: ResponsePlaylists;
  randomSongs: ResponseSongs;
  // Podcast
  podcasts: ResponsePodcasts;
  // Radio Stations
  internetRadioStations: ResponseInternetRadioStations;
  // Search Results
  searchResult3: ResponseAllMedia;

  error?: Error;
}
