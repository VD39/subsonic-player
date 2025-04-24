export const SIDEBAR_DESKTOP_NAVIGATION = [
  {
    items: [
      {
        icon: ICONS.discover,
        title: 'Discover',
        to: {
          name: ROUTE_NAMES.index,
        },
      },
      {
        icon: ICONS.podcast,
        title: 'Podcasts',
        to: {
          name: ROUTE_NAMES.podcasts,
        },
      },
      {
        icon: ICONS.radioStation,
        title: 'Radio Stations',
        to: {
          name: ROUTE_NAMES.radioStations,
        },
      },
      {
        icon: ICONS.queue,
        title: 'Queue',
        to: {
          name: ROUTE_NAMES.queue,
        },
      },
      {
        icon: ICONS.bookmark,
        title: 'Bookmarks',
        to: {
          name: ROUTE_NAMES.bookmarks,
        },
      },
    ],
    title: 'Browse',
  },
  {
    items: [
      {
        icon: ICONS.album,
        title: 'Albums',
        to: {
          name: ROUTE_NAMES.albums,
          params: {
            [ROUTE_PARAM_KEYS.albums.sortBy]:
              ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z'],
          },
        },
      },
      {
        icon: ICONS.artist,
        title: 'Artists',
        to: {
          name: ROUTE_NAMES.artists,
        },
      },
      {
        icon: ICONS.playlist,
        title: 'Playlists',
        to: {
          name: ROUTE_NAMES.playlists,
        },
      },
      {
        icon: ICONS.favourite,
        title: 'Favourites',
        to: {
          name: ROUTE_NAMES.favourites,
          params: {
            [ROUTE_PARAM_KEYS.favourites.mediaType]:
              ROUTE_MEDIA_TYPE_PARAMS.Albums,
          },
        },
      },
      {
        icon: ICONS.genre,
        title: 'Genres',
        to: {
          name: ROUTE_NAMES.genres,
        },
      },
    ],
    title: 'Your library',
  },
];
