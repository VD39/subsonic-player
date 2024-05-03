type MediaType = 'music' | 'podcast' | 'audiobook' | 'video';
type ResponseStatus = 'ok' | 'failed';
type PodcastStatus =
  | 'new'
  | 'downloading'
  | 'completed'
  | 'error'
  | 'deleted'
  | 'skipped';

export interface MusicFolders {
  musicFolder?: MusicFolder[];
}

export interface MusicFolder {
  id: number;
  name?: string;
}

export interface Indexes {
  lastModified: number;
  ignoredArticles: string;
  shortcut?: ResponseArtist[];
  index?: Index[];
  child?: Base[];
}

export interface Index {
  name: string;
  artist?: ResponseArtist[];
  artists?: ResponseArtist[];
}

export interface ResponseArtist extends ArtistID3 {
  id: string;
  name: string;
  artistImageUrl?: string;
  starred?: Date;
  userRating?: number;
  averageRating?: number;
}

export interface AlbumBaseGenre {
  name: string;
}

export interface ResponseGenre {
  name?: string;
  value: string;
  songCount: number;
  albumCount: number;
}

export interface Genres {
  genre?: ResponseGenre[];
}

export interface ArtistsID3 {
  ignoredArticles: string;
  index?: IndexID3[];
}

export interface IndexID3 {
  name: string;
  artist?: ArtistID3[];
}

export interface ArtistID3 {
  id: string;
  name: string;
  coverArt?: string;
  artistImageUrl?: string;
  albumCount: number;
  starred?: Date;
}

export interface ArtistWithAlbumsID3 extends ArtistID3 {
  album?: AlbumID3[];
}

export interface AlbumID3 {
  id: string;
  name: string;
  artist?: string;
  artists?: ResponseArtist[];
  artistId?: string;
  coverArt?: string;
  songCount: number;
  duration: number;
  playCount?: number;
  created: Date;
  starred?: Date;
  year?: number;
  genre?: string;
  genres?: AlbumBaseGenre[];
}

export interface AlbumWithSongsID3 extends AlbumID3 {
  song?: Base[];
}

export interface Videos {
  video?: Base[];
}

export interface VideoInfo {
  id: string;
  captions?: Captions[];
  audioTrack?: AudioTrack[];
  conversion?: VideoConversion[];
}

export interface Captions {
  id: string;
  name?: string;
}

export interface AudioTrack {
  id: string;
  name?: string;
  languageCode?: string;
}

export interface VideoConversion {
  id: string;
  bitRate?: number;
  audioTrackId?: number;
}

export interface Directory {
  id: string;
  parent?: string;
  name: string;
  starred?: Date;
  userRating?: number;
  averageRating?: number;
  playCount?: number;
  child?: Base[];
}

export interface Base {
  id: string;
  parent?: string;
  isDir: boolean;
  title: string;
  album?: string;
  artist?: string;
  artists?: ResponseArtist[];
  track?: number;
  year?: number;
  genre?: string;
  genres?: AlbumBaseGenre[];
  coverArt?: string;
  size?: number;
  contentType?: string;
  suffix?: string;
  transcodedContentType?: string;
  transcodedSuffix?: string;
  duration?: number;
  bitRate?: number;
  path?: string;
  isVideo?: boolean;
  userRating?: number;
  averageRating?: number;
  playCount?: number;
  discNumber?: number;
  created?: Date;
  starred?: Date;
  albumId?: string;
  artistId?: string;
  type?: MediaType;
  bookmarkPosition?: number;
  originalWidth?: number;
  originalHeight?: number;
}

export interface NowPlaying {
  entry?: NowPlayingEntry[];
}

export interface NowPlayingEntry extends Base {
  username: string;
  minutesAgo: number;
  playerId: number;
  playerName?: string;
}

export interface SearchResult {
  offset: number;
  totalHits: number;
  match?: Base[];
}

export interface SearchResult2 {
  artist?: ResponseArtist[];
  album?: Base[];
  song?: Base[];
}

export interface SearchResult3 {
  artist?: ArtistID3[];
  album?: AlbumID3[];
  song?: Base[];
}

export interface Playlists {
  playlist?: ResponsePlaylist[];
}

export interface ResponsePlaylist {
  id: string;
  name: string;
  comment?: string;
  owner?: string;
  public?: boolean;
  songCount: number;
  duration: number;
  created: Date;
  changed: Date;
  coverArt?: string;
  allowedUser?: string[];
}

export interface PlaylistWithSongs extends ResponsePlaylist {
  entry?: Base[];
}

export interface JukeboxStatus {
  currentIndex: number;
  playing: boolean;
  gain: number;
  position?: number;
}

export interface JukeboxPlaylist extends JukeboxStatus {
  entry?: Base[];
}

export interface ChatMessages {
  chatMessage?: ChatMessage[];
}

export interface ChatMessage {
  username: string;
  time: number;
  message: string;
}

export interface AlbumList {
  album?: Base[];
}

export interface AlbumList2 {
  album?: AlbumID3[];
}

export interface Songs {
  song?: Base[];
}

export interface Lyrics {
  artist?: string;
  title?: string;
}

export interface ResponsePodcastEpisode extends Base {
  streamId?: string;
  channelId: string;
  description?: string;
  status: PodcastStatus;
  publishDate?: Date;
}

export interface PodcastChannel {
  id: string;
  url: string;
  title?: string;
  description?: string;
  coverArt?: string;
  originalImageUrl?: string;
  status: PodcastStatus;
  errorMessage?: string;
  episode?: ResponsePodcastEpisode[];
}

export interface NewestPodcasts {
  episode?: ResponsePodcastEpisode[];
}

export interface Podcasts {
  channel?: PodcastChannel[];
}

export interface InternetRadioStations {
  internetRadioStation?: InternetRadioStation[];
}

export interface InternetRadioStation {
  id: string;
  name: string;
  streamUrl: string;
  homePageUrl?: string;
  homepageUrl?: string;
}

export interface Bookmarks {
  bookmark?: Bookmark[];
}

export interface Bookmark {
  position: number;
  username: string;
  comment?: string;
  created: Date;
  changed: Date;
  entry: Base;
}

export interface PlayQueue {
  current?: number;
  position?: number;
  username: string;
  changed: Date;
  changedBy: string;
  entry?: Base[];
}

export interface Shares {
  share?: Share[];
}

export interface Share {
  id: string;
  url: string;
  description?: string;
  username: string;
  created: Date;
  expires?: string;
  lastVisited?: string;
  visitCount: number;
  entry?: Base[];
}

export interface Starred {
  artist?: ResponseArtist[];
  album?: Base[];
  song?: Base[];
}

export interface AlbumInfo {
  notes?: string;
  musicBrainzId?: string;
  lastFmUrl?: string;
  smallImageUrl?: string;
  mediumImageUrl?: string;
  largeImageUrl?: string;
}

export interface ArtistInfoBase {
  biography?: string;
  musicBrainzId?: string;
  lastFmUrl?: string;
  smallImageUrl?: string;
  mediumImageUrl?: string;
  largeImageUrl?: string;
}

export interface ArtistInfo extends ArtistInfoBase {
  similarArtist?: ResponseArtist[];
}

export interface ArtistInfo2 extends ArtistInfoBase {
  similarArtist?: ArtistID3[];
}

export interface SimilarSongs {
  song?: Base[];
}

export interface SimilarSongs2 {
  song?: Base[];
}

export interface TopSongs {
  song?: Base[];
}

export interface Starred2 {
  artist?: ArtistID3[];
  album?: AlbumID3[];
  song?: Base[];
}

export interface License {
  valid: boolean;
  email?: string;
  licenseExpires?: string;
  trialExpires?: string;
}

export interface ScanStatus {
  scanning: boolean;
  count?: number;
}

export interface Users {
  user?: CurrentUser[];
}

export interface CurrentUser {
  username: string;
  email?: string;
  scrobblingEnabled: boolean;
  maxBitRate?: number;
  adminRole: boolean;
  settingsRole: boolean;
  downloadRole: boolean;
  uploadRole: boolean;
  playlistRole: boolean;
  coverArtRole: boolean;
  commentRole: boolean;
  podcastRole: boolean;
  streamRole: boolean;
  jukeboxRole: boolean;
  shareRole: boolean;
  videoConversionRole: boolean;
  avatarLastchanged: Date;
  folder?: number[];
}

export interface Error {
  code: number;
  message?: string;
}

export interface SubsonicResponse {
  // Base Subsonic Response.
  status: ResponseStatus;
  version: string;
  type: string;
  serverVersion: string;
  openSubsonic: boolean;
  // API response.
  musicFolders: MusicFolders;
  indexes: Indexes;
  directory: Directory;
  genres: Genres;
  artists: ArtistsID3;
  artist: ArtistWithAlbumsID3;
  album: AlbumWithSongsID3;
  song: Base;
  videos: Videos;
  videoInfo: VideoInfo;
  nowPlaying: NowPlaying;
  searchResult: SearchResult;
  searchResult2: SearchResult2;
  searchResult3: SearchResult3;
  playlists: Playlists;
  playlist: PlaylistWithSongs;
  jukeboxStatus: JukeboxStatus;
  jukeboxPlaylist: JukeboxPlaylist;
  license: License;
  users: Users;
  user: CurrentUser;
  chatMessages: ChatMessages;
  albumList: AlbumList;
  albumList2: AlbumList2;
  randomSongs: Songs;
  songsByGenre: Songs;
  lyrics: Lyrics;
  podcasts: Podcasts;
  newestPodcasts: NewestPodcasts;
  internetRadioStations: InternetRadioStations;
  bookmarks: Bookmarks;
  playQueue: PlayQueue;
  shares: Shares;
  starred: Starred;
  starred2: Starred2;
  albumInfo: AlbumInfo;
  artistInfo: ArtistInfo;
  artistInfo2: ArtistInfo2;
  similarSongs: SimilarSongs;
  similarSongs2: SimilarSongs2;
  topSongs: TopSongs;
  scanStatus: ScanStatus;
  error: Error;
}
