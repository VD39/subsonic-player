import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useNavigation } from './index';

const routeMock = reactive({
  name: 'index',
});

mockNuxtImport('useRoute', () => () => routeMock);

const showPodcastsMock = ref(true);
const showRadioStationsMock = ref(true);

mockNuxtImport('useSettings', (original) => () => ({
  ...original(),
  showPodcasts: showPodcastsMock,
  showRadioStations: showRadioStationsMock,
}));

describe('useNavigation', () => {
  let composable: ReturnType<typeof useNavigation>;

  beforeAll(() => {
    composable = useNavigation();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the showPodcasts value is false', () => {
    beforeAll(() => {
      showPodcastsMock.value = false;
    });

    it('sets the correct sidebarNavigation value', () => {
      expect(composable.sidebarNavigation.value).toEqual([
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
              icon: ICONS.radioStation,
              title: 'Radio Stations',
              to: {
                name: ROUTE_NAMES.radioStations,
              },
            },
            {
              icon: ICONS.queue,
              isDroppable: true,
              title: 'Queue',
              to: {
                name: ROUTE_NAMES.queue,
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
      ]);
    });

    it('sets the correct mobileNavigation value', () => {
      expect(composable.mobileNavigation.value).toEqual([
        {
          icon: ICONS.discover,
          title: 'Browse',
          to: {
            name: ROUTE_NAMES.index,
          },
        },
        {
          icon: ICONS.music,
          title: 'Your library',
          to: {
            name: ROUTE_NAMES.library,
          },
        },
        {
          icon: ICONS.playlist,
          title: 'Playlists',
          to: {
            name: ROUTE_NAMES.playlists,
          },
        },
      ]);
    });

    it('sets the correct mobilePageNavigation value', () => {
      expect(composable.mobilePageNavigation.value).toEqual({
        Discover: {
          name: ROUTE_NAMES.index,
        },
        'Radio Stations': {
          name: ROUTE_NAMES.radioStations,
        },
      });
    });

    it('sets the correct mobileTabRoutes value', () => {
      expect(composable.mobileTabRoutes.value).toEqual([
        ROUTE_NAMES.index,
        ROUTE_NAMES.radioStations,
      ]);
    });

    it('sets the correct showPageNavigation value', () => {
      expect(composable.showPageNavigation.value).toBe(true);
    });
  });

  describe('when the showPodcasts value is true', () => {
    beforeAll(() => {
      showPodcastsMock.value = true;
    });

    it('sets the correct sidebarNavigation value', () => {
      expect(composable.sidebarNavigation.value).toEqual(
        SIDEBAR_DESKTOP_NAVIGATION,
      );
    });

    it('sets the correct mobileNavigation value', () => {
      expect(composable.mobileNavigation.value).toEqual(MOBILE_NAVIGATION);
    });

    it('sets the correct mobilePageNavigation value', () => {
      expect(composable.mobilePageNavigation.value).toEqual(
        MOBILE_PAGE_NAVIGATION,
      );
    });

    it('sets the correct mobileTabRoutes value', () => {
      expect(composable.mobileTabRoutes.value).toEqual([
        ROUTE_NAMES.index,
        ROUTE_NAMES.podcast,
        ROUTE_NAMES.podcasts,
        ROUTE_NAMES.radioStations,
      ]);
    });

    it('sets the correct showPageNavigation value', () => {
      expect(composable.showPageNavigation.value).toBe(true);
    });
  });

  describe('when the showRadioStations value is false', () => {
    beforeAll(() => {
      showPodcastsMock.value = true;
      showRadioStationsMock.value = false;
    });

    it('sets the correct sidebarNavigation value', () => {
      expect(composable.sidebarNavigation.value).toEqual([
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
              icon: ICONS.queue,
              isDroppable: true,
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
      ]);
    });

    it('sets the correct mobileNavigation value', () => {
      expect(composable.mobileNavigation.value).toEqual(MOBILE_NAVIGATION);
    });

    it('sets the correct mobilePageNavigation value', () => {
      expect(composable.mobilePageNavigation.value).toEqual({
        Discover: {
          name: ROUTE_NAMES.index,
        },
        Podcasts: {
          name: ROUTE_NAMES.podcasts,
        },
      });
    });

    it('sets the correct mobileTabRoutes value', () => {
      expect(composable.mobileTabRoutes.value).toEqual([
        ROUTE_NAMES.index,
        ROUTE_NAMES.podcast,
        ROUTE_NAMES.podcasts,
      ]);
    });

    it('sets the correct showPageNavigation value', () => {
      expect(composable.showPageNavigation.value).toBe(true);
    });
  });

  describe('when the showRadioStations value is true', () => {
    beforeAll(() => {
      showPodcastsMock.value = true;
      showRadioStationsMock.value = true;
    });

    it('sets the correct sidebarNavigation value', () => {
      expect(composable.sidebarNavigation.value).toEqual(
        SIDEBAR_DESKTOP_NAVIGATION,
      );
    });

    it('sets the correct mobileNavigation value', () => {
      expect(composable.mobileNavigation.value).toEqual(MOBILE_NAVIGATION);
    });

    it('sets the correct mobilePageNavigation value', () => {
      expect(composable.mobilePageNavigation.value).toEqual(
        MOBILE_PAGE_NAVIGATION,
      );
    });

    it('sets the correct mobileTabRoutes value', () => {
      expect(composable.mobileTabRoutes.value).toEqual([
        ROUTE_NAMES.index,
        ROUTE_NAMES.podcast,
        ROUTE_NAMES.podcasts,
        ROUTE_NAMES.radioStations,
      ]);
    });

    it('sets the correct showPageNavigation value', () => {
      expect(composable.showPageNavigation.value).toBe(true);
    });
  });

  describe('when the showPodcasts value is false and the showRadioStations value is false', () => {
    beforeAll(() => {
      showPodcastsMock.value = false;
      showRadioStationsMock.value = false;
    });

    it('sets the correct sidebarNavigation value', () => {
      expect(composable.sidebarNavigation.value).toEqual([
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
              icon: ICONS.queue,
              isDroppable: true,
              title: 'Queue',
              to: {
                name: ROUTE_NAMES.queue,
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
      ]);
    });

    it('sets the correct mobileNavigation value', () => {
      expect(composable.mobileNavigation.value).toEqual([
        {
          icon: ICONS.discover,
          title: 'Browse',
          to: {
            name: ROUTE_NAMES.index,
          },
        },
        {
          icon: ICONS.music,
          title: 'Your library',
          to: {
            name: ROUTE_NAMES.library,
          },
        },
        {
          icon: ICONS.playlist,
          title: 'Playlists',
          to: {
            name: ROUTE_NAMES.playlists,
          },
        },
      ]);
    });

    it('sets the correct mobilePageNavigation value', () => {
      expect(composable.mobilePageNavigation.value).toEqual({
        Discover: {
          name: ROUTE_NAMES.index,
        },
      });
    });

    it('sets the correct mobileTabRoutes value', () => {
      expect(composable.mobileTabRoutes.value).toEqual([ROUTE_NAMES.index]);
    });

    it('sets the correct showPageNavigation value', () => {
      expect(composable.showPageNavigation.value).toBe(false);
    });
  });

  describe('when the route name is not in the navigation', () => {
    beforeAll(() => {
      routeMock.name = 'not-in-navigation';
    });

    it('sets the correct showPageNavigation value', () => {
      expect(composable.showPageNavigation.value).toBe(false);
    });
  });
});
