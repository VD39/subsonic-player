export type MediaType =
  | 'album'
  | 'artist'
  | 'playlist'
  | 'radioStation'
  | 'podcast'
  | 'podcastEpisode'
  | 'track';

export interface Genre {
  name: string;
}

interface TrackInformation {
  bitRate?: number;
  contentType?: string;
  created?: Date;
  path?: string;
  playCount?: number;
  suffix?: string;
  transcodedContentType?: string;
  transcodedSuffix?: string;
}

export interface Track {
  id: string;
  album?: string;
  albumId?: string;
  artists: BaseArtist[];
  discNumber?: number;
  duration: string;
  favourite: boolean;
  genres: Genre[];
  image: string;
  information: TrackInformation;
  size: string;
  streamUrl: string;
  name: string;
  trackNumber?: number;
  type: MediaType;
  year?: number;
}

interface AlbumTrack {
  playCount?: number;
}

export interface Album {
  artists: BaseArtist[];
  created: string;
  duration: string;
  favourite: boolean;
  genres: Genre[];
  id: string;
  image: string;
  information: AlbumTrack;
  name: string;
  size: string;
  songCount: number;
  tracks: Track[];
  type: MediaType;
  year?: number;
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
  image: string;
  lastFmUrl?: string;
  musicBrainzUrl?: string;
  totalAlbums: number;
  totalTracks: number;
  type: MediaType;
}

interface PlaylistInformation {
  changed?: Date;
  comment?: string;
  created?: Date;
  owner?: string;
  public?: boolean;
}

export interface Playlist {
  duration: string;
  id: string;
  images: string[];
  information: PlaylistInformation;
  name: string;
  songCount: number;
  tracks: Track[];
  type: MediaType;
}

export interface RadioStation {
  duration: string;
  image: string;
  id: string;
  name: string;
  streamUrl: string;
  homePageUrl?: string;
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
  image: string;
  publishDate: Date | string;
  streamUrl?: string;
  name: string;
  type: MediaType;
}

export interface Podcast {
  description?: string;
  downloadedEpisodes: number;
  episodes: PodcastEpisode[];
  id: string;
  image: string;
  lastUpdated: string;
  name: string;
  totalEpisodes: number;
  type: MediaType;
  url: string;
}
