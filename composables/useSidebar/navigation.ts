import AddNewPlaylist from '@/components/Playlists/AddNewPlaylist.vue';
import CurrentPlaylists from '@/components/Playlists/CurrentPlaylists.vue';

export const SIDEBAR_NAVIGATION = [
  {
    title: 'Browse',
    icon: 'PhCompass',
    to: '/discover',
    items: [
      {
        title: 'Discover',
        to: '/discover',
        icon: 'PhCompass',
      },
      {
        title: 'Music',
        to: '/music',
        icon: 'PhMusicNotes',
      },
      {
        title: 'Radio Stations',
        to: '/radio-stations',
        icon: 'PhRadio',
      },
      {
        title: 'Podcasts',
        to: '/podcasts',
        icon: 'PhApplePodcastsLogo',
      },
    ],
  },
  {
    title: 'Your library',
    icon: 'PhMusicNotes',
    to: '/library',
    items: [
      {
        title: 'Albums',
        to: '/albums',
        icon: 'PhVinylRecord',
      },
      {
        title: 'Artists',
        to: '/artists',
        icon: 'PhUsersThree',
      },
      {
        title: 'Playlists',
        to: '/playlists',
        icon: 'PhPlaylist',
      },
      {
        title: 'Favourites',
        to: '/favourites',
        icon: 'PhHeart',
      },
      {
        title: 'Genres',
        to: '/genres',
        icon: 'PhWaveform',
      },
    ],
  },
  {
    title: 'Playlists',
    icon: 'PhPlaylist',
    to: '/playlists',
    items: [
      {
        title: 'Random',
        to: '/playlist/random',
        icon: 'PhQueue',
      },
      {
        component: markRaw(CurrentPlaylists),
      },
      {
        component: markRaw(AddNewPlaylist),
      },
    ],
  },
] as Navigation[];
