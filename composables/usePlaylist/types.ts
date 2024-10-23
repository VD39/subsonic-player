export interface PlaylistParam {
  comment?: string;
  name?: string;
  playlistId: string;
  public?: boolean;
  songIdToAdd?: string;
  songIndexToRemove?: string;
}
