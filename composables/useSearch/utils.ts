export function toAlbumSuggestion(album: Album): SearchSuggestion {
  return {
    artists: album.artists,
    icon: ICONS.album,
    id: `album-${album.id}`,
    name: album.name,
    route: {
      name: ROUTE_NAMES.album,
      params: {
        [ROUTE_PARAM_KEYS.album.id]: album.id,
      },
    },
    type: MEDIA_TYPE.album,
  };
}

export function toArtistSuggestion(artist: Artist): SearchSuggestion {
  return {
    artists: [],
    icon: ICONS.artist,
    id: `artist-${artist.id}`,
    name: artist.name,
    route: {
      name: ROUTE_NAMES.artist,
      params: {
        [ROUTE_PARAM_KEYS.artist.id]: artist.id,
      },
    },
    type: MEDIA_TYPE.artist,
  };
}

export function toTrackSuggestion(
  track: Track,
  query: string,
): SearchSuggestion {
  return {
    artists: track.artists,
    icon: ICONS.track,
    id: `track-${track.id}`,
    name: track.name,
    route: {
      name: ROUTE_NAMES.search,
      params: {
        [ROUTE_PARAM_KEYS.search.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        [ROUTE_PARAM_KEYS.search.query]: query,
      },
    },
    track,
    type: MEDIA_TYPE.track,
  };
}
