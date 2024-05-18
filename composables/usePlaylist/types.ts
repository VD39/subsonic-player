export interface PlaylistParam {
  playlistId: string;
  name?: string;
  comment?: string;
  public?: boolean;
  songIdToAdd?: string;
  songIndexToRemove?: string;
}
