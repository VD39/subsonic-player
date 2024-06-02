import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import genreMiddleware from './genre';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('genre-middleware', () => {
  beforeEach(() => {
    genreMiddleware(routeMock, routeMock);
  });

  describe('when to.params.mediaType and to.params.genre are not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/genres');
    });
  });

  describe('when to.params.mediaType and to.params.genre are defined', () => {
    describe('when to.params.mediaType is not albums', () => {
      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/genres');
      });
    });

    describe('when to.params.mediaType is not tracks', () => {
      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/genres');
      });
    });

    describe('when to.params.mediaType is albums', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        genreMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'albums',
              genre: 'genre',
            },
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toBeCalled();
      });
    });

    describe('when to.params.mediaType is tracks', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        genreMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'tracks',
              genre: 'genre',
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
