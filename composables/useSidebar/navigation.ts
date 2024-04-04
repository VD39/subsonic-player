export const SIDEBAR_NAVIGATION = [
  {
    title: '',
    items: [
      {
        name: 'Discover',
        title: 'Discover',
        to: '/discover',
        icon: 'compact-disc',
      },
    ],
  },
  {
    title: 'Browse',
    items: [
      {
        name: 'Music',
        title: 'Music',
        to: '/music',
        icon: 'headphones',
      },
      {
        name: 'Radio Stations',
        title: 'Radio Stations',
        to: 'radio-stations',
        icon: 'radio',
      },
      {
        name: 'Podcasts',
        title: 'Podcasts',
        to: '/podcasts',
        icon: 'podcast',
      },
    ],
  },
  {
    title: 'Music',
    items: [
      {
        name: 'Albums',
        title: 'Albums',
        to: '/albums',
        icon: 'compact-disc',
      },
      {
        name: 'Artists',
        title: 'Artists',
        to: '/artists',
        icon: 'users',
      },
      {
        name: 'Playlists',
        title: 'Playlists',
        to: '/playlists',
        icon: 'list',
      },
      {
        name: 'Favourites',
        title: 'Favourites',
        to: '/favourites',
        icon: 'heart',
      },
      {
        name: 'Genres',
        title: 'Genres',
        to: '/genres',
        icon: 'music',
      },
    ],
  },
  {
    title: 'Playlists',
    items: [
      {
        name: 'Random',
        title: 'Random Playlist',
        to: '/playlist/random',
        icon: 'list',
      },
    ],
  },
] as Navigation[];
