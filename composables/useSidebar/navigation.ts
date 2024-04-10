export const SIDEBAR_NAVIGATION = [
  {
    title: 'Browse',
    icon: 'compass',
    to: '/browse',
    items: [
      {
        title: 'Discover',
        to: '/discover',
        icon: 'magnifying-glass',
      },
      {
        title: 'Music',
        to: '/music',
        icon: 'headphones',
      },
      {
        title: 'Radio Stations',
        to: 'radio-stations',
        icon: 'radio',
      },
      {
        title: 'Podcasts',
        to: '/podcasts',
        icon: 'podcast',
      },
    ],
  },
  {
    title: 'Your library',
    icon: 'music',
    to: '/library',
    items: [
      {
        title: 'Albums',
        to: '/albums',
        icon: 'compact-disc',
      },
      {
        title: 'Artists',
        to: '/artists',
        icon: 'users',
      },
      {
        title: 'Playlists',
        to: '/playlists',
        icon: 'list',
      },
      {
        title: 'Favourites',
        to: '/favourites',
        icon: 'heart',
      },
      {
        title: 'Genres',
        to: '/genres',
        icon: 'music',
      },
    ],
  },
  {
    title: 'Playlists',
    icon: 'list',
    to: '/playlist',
    items: [
      {
        title: 'Random',
        to: '/playlist/random',
        icon: 'list',
      },
    ],
  },
] as Navigation[];
