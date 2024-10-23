import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import albumsMiddleware from './albums';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('albums-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.sortBy is not defined', () => {
    beforeEach(() => {
      albumsMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/albums/a-z');
    });
  });

  describe('when to.params.sortBy is defined', () => {
    describe('when to.params.sortBy is not key of ALBUMS_SORT_BY', () => {
      beforeEach(() => {
        albumsMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              sortBy: 'sortBy',
            },
          },
          routeMock,
        );
      });

      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/albums/a-z');
      });
    });

    describe.each([...Object.keys(ALBUMS_SORT_BY)])(
      'when when to.params.sortBy is %s',
      (sortBy) => {
        beforeEach(() => {
          albumsMiddleware(
            {
              ...routeMock,
              params: {
                ...routeMock.params,
                sortBy,
              },
            },
            routeMock,
          );
        });

        it('does not call the navigateTo function', () => {
          expect(navigateToMock).not.toBeCalled();
        });
      },
    );
  });
});
