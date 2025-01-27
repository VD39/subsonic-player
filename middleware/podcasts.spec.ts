import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import podcastsMiddleware from './podcasts';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('podcasts-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.sortBy and to.params.id are not defined', () => {
    beforeEach(() => {
      podcastsMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/podcasts/recent');
    });
  });

  describe('when to.params.sortBy and to.params.id are defined', () => {
    describe('when to.params.sortBy is not recent/a-z', () => {
      beforeEach(() => {
        podcastsMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              id: 'id',
              sortBy: 'All',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toHaveBeenCalledWith('/podcasts/recent');
      });
    });

    describe.each([
      ROUTE_PODCASTS_SORT_BY_PARAMS.Recent,
      ROUTE_PODCASTS_SORT_BY_PARAMS['A-Z'],
    ])('when when to.params.sortBy is %s', (sortBy) => {
      beforeEach(() => {
        podcastsMiddleware(
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
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });
  });
});
