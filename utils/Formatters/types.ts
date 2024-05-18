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
  id?: string;
  album?: string;
  albumId?: string;
  artists: BaseArtist[];
  discNumber?: number;
  duration?: number;
  favourite: boolean;
  genres: Genre[];
  image?: string;
  information: TrackInformation;
  size?: number;
  streamId: string;
  title: string;
  track?: number;
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
  image?: string;
  information: AlbumTrack;
  name: string;
  size: number;
  songCount: number;
  tracks: Track[];
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
  image?: string;
  lastFmUrl?: string;
  musicBrainzUrl?: string;
  totalAlbums: number;
  totalTracks: number;
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
}

export interface RadioStation {
  image: string;
  isRadioStation: boolean;
  id: string;
  name: string;
  streamUrl: string;
  homePageUrl?: string;
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
  image: string;
  isPodcast: boolean;
  publishDate?: Date;
  streamId: string | null;
}

export interface Podcast {
  description?: string;
  downloadedEpisodes: number;
  episodes: PodcastEpisode[];
  id: string;
  image: string;
  lastUpdated: string;
  title: string;
  totalEpisodes: number;
  url: string;
}
