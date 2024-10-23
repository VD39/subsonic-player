import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import podcastMiddleware from './podcast';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('podcast-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.sortBy and to.params.id are not defined', () => {
    beforeEach(() => {
      podcastMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/podcasts/recent');
    });
  });

  describe('when to.params.sortBy and to.params.id are defined', () => {
    describe('when to.params.sortBy is not all/downloaded/not downloaded', () => {
      beforeEach(() => {
        podcastMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              id: 'id',
              sortBy: 'Recent',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/podcasts/recent');
      });
    });

    describe.each([
      ROUTE_PODCAST_SORT_BY_PARAMS.All,
      ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded,
      ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded'],
    ])('when when to.params.sortBy is %s', (sortBy) => {
      beforeEach(() => {
        podcastMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              id: 'id',
              sortBy,
            },
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toBeCalled();
      });
    });
  });
});
