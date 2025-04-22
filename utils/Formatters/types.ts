export interface Album {
  artists: BaseArtist[];
  created: string;
  duration: string;
  favourite: boolean;
  genres: Genre[];
  id: string;
  image: Image;
  information: AlbumTrack;
  name: string;
  size: string;
  totalDiscNumber: number;
  trackCount: number;
  tracks: Track[];
  tracksByDiscNumber: TracksByDiscNumber;
  type: MediaType;
  year: number | string;
}
export interface AllMedia {
  albums: Album[];
  artists: Artist[];
  tracks: Track[];
}

export interface Artist extends BaseArtist {
  albums: Album[];
  biography?: string;
  favourite: boolean;
  genres: Genre[];
  image: Image;
  lastFmUrl?: string;
  musicBrainzUrl?: string;
  similarArtist: SimilarArtist[];
  totalAlbums: number;
  totalTracks: number;
  type: MediaType;
}

export interface BaseArtist {
  id: string;
  name: string;
}

export interface Bookmark extends PodcastEpisode {
  position: string;
  rawPosition: number;
}

export interface Genre {
  albumCount?: number;
  name: string;
  trackCount?: number;
}

export type MediaType = TypeofMediaType[keyof TypeofMediaType];

export interface Playlist {
  duration: string;
  id: string;
  images: string[];
  information: PlaylistInformation;
  name: string;
  trackCount: number;
  tracks: (PodcastEpisode | Track)[];
  type: MediaType;
}

export interface Podcast {
  description?: string;
  episodes: Record<PodcastSortByParam, PodcastEpisode[]>;
  id: string;
  image: Image;
  lastUpdated: string;
  name: string;
  totalDownloadedEpisodes: number;
  totalEpisodes: number;
  type: MediaType;
  url: string;
}

export interface PodcastEpisode {
  author: string;
  description?: string;
  downloaded: boolean;
  duration: string;
  genres: Genre[];
  id: string;
  image: Image;
  name: string;
  podcastId?: string;
  podcastName: string;
  publishDate: string;
  streamUrlId?: string;
  trackNumber: number | string;
  type: MediaType;
}

export interface RadioStation {
  duration: string;
  homePageUrl?: string;
  id: string;
  image: Image;
  name: string;
  streamUrlId: string;
  trackNumber: number | string;
  type: MediaType;
}

export interface SimilarArtist extends BaseArtist {
  image: string;
}

export interface Track {
  album: string;
  albumId?: string;
  artists: BaseArtist[];
  discNumber: number | string;
  duration: string;
  favourite: boolean;
  genres: Genre[];
  id: string;
  image: Image;
  index: number;
  information: TrackInformation;
  name: string;
  size: string;
  streamUrlId: string;
  trackNumber: number | string;
  type: MediaType;
  year: number | string;
}

export interface TracksByDiscNumber {
  [key: string]: Track[];
}

interface AlbumTrack {
  playCount: number;
}

interface PlaylistInformation {
  changed: string;
  comment?: string;
  created: string;
  owner: string;
  public: boolean;
}

interface TrackInformation {
  bitRate: string;
  contentType: string;
  created: string;
  path: string;
  playCount: number;
  suffix: string;
  transcodedContentType: string;
  transcodedSuffix: string;
}

type TypeofMediaType = typeof MEDIA_TYPE;
