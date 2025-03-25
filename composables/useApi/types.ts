export interface AlbumBaseGenre {
  name: string;
}
export interface AlbumID3 {
  artist?: string;
  artistId?: string;
  artists?: ResponseArtist[];
  coverArt?: string;
  created: Date;
  duration: number;
  genre?: string;
  genres?: AlbumBaseGenre[];
  id: string;
  name: string;
  playCount?: number;
  songCount: number;
  starred?: Date;
  year?: number;
}
export interface AlbumInfo {
  largeImageUrl?: string;
  lastFmUrl?: string;
  mediumImageUrl?: string;
  musicBrainzId?: string;
  notes?: string;
  smallImageUrl?: string;
}

export interface AlbumList {
  album?: Base[];
}

export interface AlbumList2 {
  album?: AlbumID3[];
}

export interface AlbumWithSongsID3 extends AlbumID3 {
  song?: Base[];
}

export interface ArtistID3 {
  albumCount: number;
  artistImageUrl?: string;
  coverArt?: string;
  id: string;
  name: string;
  starred?: Date;
}

export interface ArtistInfo extends ArtistInfoBase {
  similarArtist?: ResponseArtist[];
}

export interface ArtistInfo2 extends ArtistInfoBase {
  similarArtist?: ArtistID3[];
}

export interface ArtistInfoBase {
  biography?: string;
  largeImageUrl?: string;
  lastFmUrl?: string;
  mediumImageUrl?: string;
  musicBrainzId?: string;
  smallImageUrl?: string;
}

export interface ArtistsID3 {
  ignoredArticles: string;
  index?: IndexID3[];
}

export interface ArtistWithAlbumsID3 extends ArtistID3 {
  album?: AlbumID3[];
}

export interface AudioTrack {
  id: string;
  languageCode?: string;
  name?: string;
}

export interface Base {
  album?: string;
  albumId?: string;
  artist?: string;
  artistId?: string;
  artists?: ResponseArtist[];
  averageRating?: number;
  bitRate?: number;
  bookmarkPosition?: number;
  contentType?: string;
  coverArt?: string;
  created?: Date;
  discNumber?: number;
  duration?: number;
  genre?: string;
  genres?: AlbumBaseGenre[];
  id: string;
  isDir: boolean;
  isVideo?: boolean;
  originalHeight?: number;
  originalWidth?: number;
  parent?: string;
  path?: string;
  playCount?: number;
  size?: number;
  starred?: Date;
  suffix?: string;
  title: string;
  track?: number;
  transcodedContentType?: string;
  transcodedSuffix?: string;
  type?: MediaType;
  userRating?: number;
  year?: number;
}

export interface Bookmark {
  changed: Date;
  comment?: string;
  created: Date;
  entry: Base;
  position: number;
  username: string;
}

export interface Bookmarks {
  bookmark?: Bookmark[];
}

export interface Captions {
  id: string;
  name?: string;
}

export interface ChatMessage {
  message: string;
  time: number;
  username: string;
}

export interface ChatMessages {
  chatMessage?: ChatMessage[];
}

export interface CurrentUser {
  adminRole: boolean;
  avatarLastchanged: Date;
  commentRole: boolean;
  coverArtRole: boolean;
  downloadRole: boolean;
  email?: string;
  folder?: number[];
  jukeboxRole: boolean;
  maxBitRate?: number;
  playlistRole: boolean;
  podcastRole: boolean;
  scrobblingEnabled: boolean;
  settingsRole: boolean;
  shareRole: boolean;
  streamRole: boolean;
  uploadRole: boolean;
  username: string;
  videoConversionRole: boolean;
}

export interface Directory {
  averageRating?: number;
  child?: Base[];
  id: string;
  name: string;
  parent?: string;
  playCount?: number;
  starred?: Date;
  userRating?: number;
}

export interface Error {
  code: number;
  message?: string;
}

export interface Genres {
  genre?: ResponseGenre[];
}

export interface Index {
  artist?: ResponseArtist[];
  artists?: ResponseArtist[];
  name: string;
}

export interface Indexes {
  child?: Base[];
  ignoredArticles: string;
  index?: Index[];
  lastModified: number;
  shortcut?: ResponseArtist[];
}

export interface IndexID3 {
  artist?: ArtistID3[];
  name: string;
}

export interface InternetRadioStation {
  homePageUrl?: string;
  homepageUrl?: string;
  id: string;
  name: string;
  streamUrl: string;
}

export interface InternetRadioStations {
  internetRadioStation?: InternetRadioStation[];
}

export interface JukeboxPlaylist extends JukeboxStatus {
  entry?: Base[];
}

export interface JukeboxStatus {
  currentIndex: number;
  gain: number;
  playing: boolean;
  position?: number;
}

export interface License {
  email?: string;
  licenseExpires?: string;
  trialExpires?: string;
  valid: boolean;
}

export interface Lyrics {
  artist?: string;
  title?: string;
}

export interface MusicFolders {
  musicFolder?: ResponseMusicFolder[];
}

export interface NewestPodcasts {
  episode?: ResponsePodcastEpisode[];
}

export interface NowPlaying {
  entry?: NowPlayingEntry[];
}

export interface NowPlayingEntry extends Base {
  minutesAgo: number;
  playerId: number;
  playerName?: string;
  username: string;
}

export interface Playlists {
  playlist?: ResponsePlaylist[];
}

export interface PlaylistWithSongs extends ResponsePlaylist {
  entry?: Base[];
}

export interface PlayQueue {
  changed: Date;
  changedBy: string;
  current?: number;
  entry?: Base[];
  position?: number;
  username: string;
}

export interface PodcastChannel {
  coverArt?: string;
  description?: string;
  episode?: ResponsePodcastEpisode[];
  errorMessage?: string;
  id: string;
  originalImageUrl?: string;
  status: PodcastStatus;
  title?: string;
  url: string;
}

export interface Podcasts {
  channel?: PodcastChannel[];
}

export interface ResponseArtist extends ArtistID3 {
  artistImageUrl?: string;
  averageRating?: number;
  id: string;
  name: string;
  starred?: Date;
  userRating?: number;
}

export interface ResponseGenre {
  albumCount: number;
  name?: string;
  songCount: number;
  value: string;
}

export interface ResponseMusicFolder {
  id: number;
  name?: string;
}

export interface ResponsePlaylist {
  allowedUser?: string[];
  changed: Date;
  comment?: string;
  coverArt?: string;
  created: Date;
  duration: number;
  id: string;
  name: string;
  owner?: string;
  public?: boolean;
  songCount: number;
}

export interface ResponsePodcastEpisode extends Base {
  channelId: string;
  description?: string;
  publishDate?: Date;
  status: PodcastStatus;
  streamId?: string;
}

export interface ScanStatus {
  count?: number;
  scanning: boolean;
}

export interface SearchResult {
  match?: Base[];
  offset: number;
  totalHits: number;
}

export interface SearchResult2 {
  album?: Base[];
  artist?: ResponseArtist[];
  song?: Base[];
}

export interface SearchResult3 {
  album?: AlbumID3[];
  artist?: ArtistID3[];
  song?: Base[];
}

export interface Share {
  created: Date;
  description?: string;
  entry?: Base[];
  expires?: string;
  id: string;
  lastVisited?: string;
  url: string;
  username: string;
  visitCount: number;
}

export interface Shares {
  share?: Share[];
}

export interface SimilarSongs {
  song?: Base[];
}

export interface SimilarSongs2 {
  song?: Base[];
}

export interface Songs {
  song?: Base[];
}

export interface Starred {
  album?: Base[];
  artist?: ResponseArtist[];
  song?: Base[];
}

export interface Starred2 {
  album?: AlbumID3[];
  artist?: ArtistID3[];
  song?: Base[];
}

export interface SubsonicResponse {
  // Base Subsonic Response.
  album: AlbumWithSongsID3;
  albumInfo: AlbumInfo;
  albumList: AlbumList;
  albumList2: AlbumList2;
  artist: ArtistWithAlbumsID3;

  artistInfo: ArtistInfo;
  artistInfo2: ArtistInfo2;
  artists: ArtistsID3;
  bookmarks: Bookmarks;
  chatMessages: ChatMessages;
  directory: Directory;
  error: Error;
  // File.
  file: Blob;
  genres: Genres;
  indexes: Indexes;
  internetRadioStations: InternetRadioStations;
  jukeboxPlaylist: JukeboxPlaylist;
  jukeboxStatus: JukeboxStatus;
  license: License;
  lyrics: Lyrics;
  musicFolders: MusicFolders;
  newestPodcasts: NewestPodcasts;
  nowPlaying: NowPlaying;
  openSubsonic: boolean;
  playlist: PlaylistWithSongs;
  playlists: Playlists;
  playQueue: PlayQueue;
  podcasts: Podcasts;
  randomSongs: Songs;
  scanStatus: ScanStatus;
  searchResult: SearchResult;
  searchResult2: SearchResult2;
  searchResult3: SearchResult3;
  serverVersion: string;
  shares: Shares;
  similarSongs: SimilarSongs;
  similarSongs2: SimilarSongs2;
  song: Base;
  songsByGenre: Songs;
  starred: Starred;
  starred2: Starred2;
  // Base Subsonic Response.
  status: ResponseStatus;
  topSongs: TopSongs;
  type: string;
  user: CurrentUser;
  users: Users;
  version: string;
  videoInfo: VideoInfo;

  videos: Videos;
}

export interface TopSongs {
  song?: Base[];
}

export interface Users {
  user?: CurrentUser[];
}

export interface VideoConversion {
  audioTrackId?: number;
  bitRate?: number;
  id: string;
}

export interface VideoInfo {
  audioTrack?: AudioTrack[];
  captions?: Captions[];
  conversion?: VideoConversion[];
  id: string;
}

export interface Videos {
  video?: Base[];
}

type MediaType = 'audiobook' | 'music' | 'podcast' | 'podcastepisode' | 'video';

type PodcastStatus =
  | 'completed'
  | 'deleted'
  | 'downloading'
  | 'error'
  | 'new'
  | 'skipped';

type ResponseStatus = 'failed' | 'ok';
