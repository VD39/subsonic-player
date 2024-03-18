export interface Artist {
  id: string;
  name: string;
  albumCount?: number;
  starred?: string;
  coverArt?: string;
  album?: Album[];
}

// Artist information
export interface ArtistInfo2 {
  biography: string;
  musicBrainzId: string;
  lastFmUrl: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
  artistImageUrl: string;
  similarArtist: Artist[];
}

export interface Index {
  name: string;
  artist: Artist[];
}

export interface Artists {
  ignoredArticles: string;
  index: Index[];
}

export interface Genre {
  name: string;
  value?: string;
  songCount?: number;
  albumCount?: number;
}

export interface ReplayGain {
  trackPeak: number;
  albumPeak: number;
}

export interface AlbumArtist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  created: string;
  artistId: string;
  artist: string;
  artists: Artist[];
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
  genres?: Genre[];
  song?: Song[];
}

export interface Song {
  id: string;
  album: string;
  albumId: string;
  artist: string;
  artistId: string;
  artists: Artist[];
  displayArtist: string;
  albumArtists: AlbumArtist[];
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
  starred: string;
  genre?: string;
  playCount?: number;
  userRating?: number;
  bookmarkPosition?: number;
  played?: string;
  bpm?: number;
  comment?: string;
  sortName?: string;
  mediaType?: string;
  genres?: Genre[];
  replayGain?: ReplayGain;
}

export interface AlbumList2 {
  album: Album[];
}

interface Genres {
  genre: Genre[];
}

export interface Songs {
  song: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  comment: string;
  owner: string;
  songCount: number;
  created: string;
  changed: string;
  duration: number;
  public?: boolean;
  entry?: Song[];
}

export interface Playlists {
  playlist: Playlist[];
}

export interface Episode {
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
  genres?: Genre[];
  coverArt: string;
  size: number;
  contentType: string;
  suffix: string;
  duration: number;
  bitrate: number;
  path: string;
}

export interface Channel {
  id: string;
  url: string;
  title: string;
  description: string;
  coverArt: string;
  originalImageUrl: string;
  status: string;
  episode: Episode[];
  date: string;
}

interface Podcasts {
  channel: Channel[];
}

export interface InternetRadioStation {
  id: string;
  name: string;
  streamUrl: string;
  homepageUrl: string;
}

export interface InternetRadioStations {
  internetRadioStation: InternetRadioStation[];
}
export interface AllMedia {
  artist?: Artist[];
  album?: Album[];
  song?: Song[];
}

export interface SubsonicResponse {
  status: string;
  version: string;
  type: string;
  serverVersion: string;
  openSubsonic: boolean;
  // fav
  starred2?: AllMedia;
  // genre
  genres?: Genres;
  songsByGenre?: Songs;
  // music
  artists?: Artists;
  artist?: Artist;
  artistInfo2?: ArtistInfo2;
  album?: Album;
  topSongs?: Songs;
  // Genre and music
  albumList2?: AlbumList2;
  // Playlists
  playlists?: Playlists;
  randomSongs?: Songs;
  playlist?: Playlist;
  // Podcast
  podcasts?: Podcasts;
  // radio station
  internetRadioStations?: InternetRadioStations;
  // Search results
  searchResult3?: AllMedia;

  error?: Error;
}
