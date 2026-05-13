export interface PlaylistParam {
  comment?: string;
  name?: string;
  playlistId: string;
  public?: boolean;
  songIdToAdd?: string | string[];
  songIndexToRemove?: number | number[];
}
