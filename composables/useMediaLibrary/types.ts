export type DownloadTrack = MixedTrack | PodcastEpisode | Track;

export interface FilesParams {
  id?: string;
  slug?: string[];
}

export interface FormattedMusicFolder extends ResponseMusicFolder {
  image: string;
}

export type MusicFolder = Artist | FormattedMusicFolder | Track;
