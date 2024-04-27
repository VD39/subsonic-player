export interface Genre extends ResponseGenre {}

export interface Artist extends Omit<ResponseArtist, 'artist' | 'artistId'> {}

export interface Song
  extends Omit<
    ResponseSong,
    'artist' | 'artistId' | 'artists' | 'genres' | 'starred'
  > {
  favourite: boolean;
  streamId: string;
  image: string;
  artists: Artist[];
  genres: Genre[];
}

export interface Playlist extends ResponsePlaylist {
  name: string;
  songs: Song[];
  images: string[];
  image?: string;
  isReadOnly: boolean;
}
