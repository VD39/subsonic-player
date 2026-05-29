export interface CreatePlaylistParam {
  name: string;
  songId?: string | string[];
}

export interface PlaylistParam {
  comment?: string;
  name?: string;
  playlistId: string;
  public?: boolean;
  songIdToAdd?: string | string[];
  songIndexToRemove?: number | number[];
}
