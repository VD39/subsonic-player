import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import albumsMiddleware from './albums';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('albums-middleware', () => {
  beforeEach(() => {
    albumsMiddleware(routeMock, routeMock);
  });

  describe('when to.params.sortBy is not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/albums/a-z');
    });
  });

  describe('when to.params.sortBy is defined', () => {
    describe('when to.params.sortBy is not key of SORT_BY_TYPES', () => {
      beforeEach(() => {
        vi.clearAllMocks();
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

    describe.each([...Object.keys(SORT_BY_TYPES)])(
      'when when to.params.sortBy is %s',
      (sortBy) => {
        beforeEach(() => {
          vi.clearAllMocks();
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
