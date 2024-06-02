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
  duration?: number;
  favourite: boolean;
  genres: Genre[];
  imageId?: string;
  information: TrackInformation;
  size?: number;
  streamId?: string;
  title: string;
  track?: number;
  type: MediaType;
  year?: number;
}

interface AlbumTrack {
  playCount?: number;
}

export interface Album {
  artists: BaseArtist[];
  created: string;
  duration: number;
  favourite: boolean;
  genres: Genre[];
  id: string;
  imageId?: string;
  information: AlbumTrack;
  name: string;
  size: number;
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
  genresList: string[];
  imageId?: string;
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
  duration: number;
  id: string;
  images: string[];
  information: PlaylistInformation;
  name: string;
  songCount: number;
  tracks: Track[];
  type: MediaType;
}

export interface RadioStation {
  image?: string;
  id: string;
  name: string;
  streamUrl: string;
  homePageUrl?: string;
  type: MediaType;
}

export interface AllMedia {
  artists: ArtistID3[];
  albums: Album[];
  tracks: Track[];
}

export interface PodcastEpisode {
  channelId: string;
  description?: string;
  downloaded: boolean;
  genres: Genre[];
  image?: string;
  publishDate?: Date;
  streamId?: string;
  type: MediaType;
}

export interface Podcast {
  description?: string;
  downloadedEpisodes: number;
  episodes: PodcastEpisode[];
  id: string;
  image?: string;
  lastUpdated: string;
  title: string;
  totalEpisodes: number;
  type: MediaType;
  url: string;
}
