import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { routeMock } from '@/test/fixtures';

import podcastMiddleware from './podcast';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('podcast-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.podcast.sortBy} and to.params.${ROUTE_PARAM_KEYS.podcast.id} are not defined`, () => {
    beforeEach(() => {
      podcastMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.podcasts,
      });
    });
  });

  describe(`when to.params.${ROUTE_PARAM_KEYS.podcast.sortBy} and to.params.${ROUTE_PARAM_KEYS.podcast.id} are defined`, () => {
    describe(`when to.params.${ROUTE_PARAM_KEYS.podcast.sortBy} is not a value of ROUTE_PODCAST_SORT_BY_PARAMS`, () => {
      beforeEach(() => {
        podcastMiddleware(
          {
            ...routeMock,
            params: {
              [ROUTE_PARAM_KEYS.podcast.id]: 'id',
              [ROUTE_PARAM_KEYS.podcast.sortBy]: 'Recent',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function with the correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.podcasts,
        });
      });
    });

    describe.each([...Object.values(ROUTE_PODCAST_SORT_BY_PARAMS)])(
      `when when to.params.${ROUTE_PARAM_KEYS.podcast.sortBy} is %s`,
      (sortBy) => {
        beforeEach(() => {
          podcastMiddleware(
            {
              ...routeMock,
              params: {
                [ROUTE_PARAM_KEYS.podcast.id]: 'id',
                [ROUTE_PARAM_KEYS.podcast.sortBy]: sortBy,
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
