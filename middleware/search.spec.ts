import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import searchMiddleware from './search';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('search-middleware', () => {
  beforeEach(() => {
    searchMiddleware(routeMock, routeMock);
  });

  describe('when to.params.mediaType and to.params.genre are not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/');
    });
  });

  describe('when to.params.mediaType and to.params.genre are defined', () => {
    describe('when to.params.mediaType is not albums', () => {
      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/');
      });
    });

    describe('when to.params.mediaType is not tracks', () => {
      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/');
      });
    });

    describe('when to.params.mediaType is not artists', () => {
      it('calls the navigateTo function', () => {
        expect(navigateToMock).toBeCalledWith('/');
      });
    });

    describe('when to.params.mediaType is albums', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        searchMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'albums',
              query: 'query',
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
        searchMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'tracks',
              query: 'query',
            },
          },
          routeMock,
        );
      });

      it('does not call the navigateTo function', () => {
        expect(navigateToMock).not.toBeCalled();
      });
    });

    describe('when to.params.mediaType is artists', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        searchMiddleware(
          {
            ...routeMock,
            params: {
              ...routeMock.params,
              mediaType: 'artists',
              query: 'query',
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
