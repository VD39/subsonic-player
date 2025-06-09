import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { routeMock } from '@/test/fixtures';

import albumsMiddleware from './albums';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('albums-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.albums.sortBy} is not defined`, () => {
    beforeEach(() => {
      albumsMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.albums,
        params: {
          [ROUTE_PARAM_KEYS.albums.sortBy]: ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z'],
        },
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.albums.sortBy} is defined`, () => {
    describe(`when to.params.${ROUTE_PARAM_KEYS.albums.sortBy} is not a value of ALBUMS_SORT_BY`, () => {
      beforeEach(() => {
        albumsMiddleware(
          {
            ...routeMock,
            params: {
              [ROUTE_PARAM_KEYS.albums.sortBy]: 'sortBy',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.albums,
          params: {
            [ROUTE_PARAM_KEYS.albums.sortBy]:
              ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z'],
          },
        });
      });
    });

    describe.each([...Object.keys(ALBUMS_SORT_BY)])(
      `when when to.params.${ROUTE_PARAM_KEYS.albums.sortBy} is %s`,
      (sortBy) => {
        beforeEach(() => {
          albumsMiddleware(
            {
              ...routeMock,
              params: {
                [ROUTE_PARAM_KEYS.albums.sortBy]: sortBy,
              },
            },
            routeMock,
          );
        });

        it('does not call the navigateTo function', () => {
          expect(navigateToMock).not.toHaveBeenCalled();
        });
      },
    );
  });
});
