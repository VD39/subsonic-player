type TypeofMediaType = typeof MEDIA_TYPE;
export type MediaType = TypeofMediaType[keyof TypeofMediaType];

export interface Genre {
  name: string;
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
  information: TrackInformation;
  name: string;
  size: string;
  streamUrl: string;
  trackNumber: number | string;
  type: MediaType;
  year: number | string;
}

interface AlbumTrack {
  playCount: number;
}

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
  trackCount: number;
  tracks: Track[];
  type: MediaType;
  year: number | string;
}

export interface BaseArtist {
  id: string;
  name: string;
}

export interface Artist extends BaseArtist {
  albums: Album[];
  biography?: string;
  favourite: boolean;
  genres: Genre[];
  image: Image;
  lastFmUrl?: string;
  musicBrainzUrl?: string;
  totalAlbums: number;
  totalTracks: number;
  type: MediaType;
}

interface PlaylistInformation {
  changed: string;
  comment?: string;
  created: string;
  owner: string;
  public: boolean;
}

export interface Playlist {
  duration: string;
  id: string;
  images: string[];
  information: PlaylistInformation;
  name: string;
  trackCount: number;
  tracks: Track[];
  type: MediaType;
}

export interface RadioStation {
  duration: string;
  homePageUrl?: string;
  id: string;
  image: Image;
  name: string;
  streamUrl: string;
  type: MediaType;
}

export interface AllMedia {
  albums: Album[];
  artists: Artist[];
  tracks: Track[];
}

export interface PodcastEpisode {
  description?: string;
  downloaded: boolean;
  duration: string;
  genres: Genre[];
  id: string;
  image: Image;
  name: string;
  publishDate: string;
  streamUrl?: string;
  type: MediaType;
}

export interface Podcast {
  description?: string;
  downloadedEpisodes: number;
  episodes: PodcastEpisode[];
  id: string;
  image: Image;
  lastUpdated: string;
  name: string;
  totalEpisodes: number;
  type: MediaType;
  url: string;
}
