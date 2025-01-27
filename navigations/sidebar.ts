export const SIDEBAR_DESKTOP_NAVIGATION = [
  {
    items: [
      {
        icon: ICONS.discover,
        title: 'Discover',
        to: '/',
      },
      {
        icon: ICONS.podcast,
        title: 'Podcasts',
        to: '/podcasts',
      },
      {
        icon: ICONS.radioStation,
        title: 'Radio Stations',
        to: '/radio-stations',
      },
      {
        icon: ICONS.queue,
        title: 'Queue',
        to: '/queue',
      },
    ],
    title: 'Browse',
  },
  {
    items: [
      {
        icon: ICONS.album,
        title: 'Albums',
        to: '/albums',
      },
      {
        icon: ICONS.artist,
        title: 'Artists',
        to: '/artists',
      },
      {
        icon: ICONS.playlist,
        title: 'Playlists',
        to: '/playlists',
      },
      {
        icon: ICONS.favourite,
        title: 'Favourites',
        to: '/favourites/albums',
      },
      {
        icon: ICONS.genre,
        title: 'Genres',
        to: '/genres',
      },
    ],
    title: 'Your library',
  },
];
