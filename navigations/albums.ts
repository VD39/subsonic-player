export const ALBUMS_NAVIGATION = [
  {
    title: 'A-Z',
    to: {
      params: {
        sortBy: 'a-z',
      },
    },
  },
  {
    title: 'Recently added',
    to: {
      params: {
        sortBy: 'recently-added',
      },
    },
  },
  {
    title: 'Recently played',
    to: {
      params: {
        sortBy: 'recently-played',
      },
    },
  },
  {
    title: 'Most played',
    to: {
      params: {
        sortBy: 'most-played',
      },
    },
  },
  {
    title: 'Random',
    to: {
      params: {
        sortBy: 'random',
      },
    },
  },
];
