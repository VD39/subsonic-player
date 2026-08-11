import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { getFormattedBookmarksMock } from '@/test/helpers';

import { useBookmark } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
  getDownloadUrl: vi.fn((path) => path),
}));

const addSuccessSnackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSnack', (original) => () => ({
  ...original(),
  addSuccessSnack: addSuccessSnackMock,
}));

const bookmarksMock = getFormattedBookmarksMock(3, {
  position: 123,
});

const bookmark = bookmarksMock[0];

describe('useBookmark', () => {
  let composable: ReturnType<typeof useBookmark>;

  beforeAll(() => {
    composable = useBookmark();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default bookmarks value', () => {
    expect(composable.bookmarks.value).toEqual([]);
  });

  describe('when the getBookmarks function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.getBookmarks();
      });

      it('sets the correct bookmarks value', () => {
        expect(composable.bookmarks.value).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: bookmarksMock,
        });

        await composable.getBookmarks();
      });

      it('sets the correct bookmarks value', () => {
        expect(composable.bookmarks.value).toEqual(bookmarksMock);
      });
    });
  });

  describe('when the createBookmark function is called', () => {
    beforeEach(() => {
      composable.createBookmark(bookmark.id, 12345);
    });

    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        composable.createBookmark(bookmark.id, 12345);
      });

      it('calls the getBookmarks function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getBookmarks',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the deleteBookmark function is called', () => {
    beforeEach(() => {
      fetchDataMock.mockResolvedValue({
        data: null,
      });

      composable.deleteBookmark(bookmark.id);
    });

    it('calls the getBookmarks function', () => {
      expect(fetchDataMock).toHaveBeenCalledWith(
        '/getBookmarks',
        expect.any(Object),
      );
    });

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: bookmark,
        });

        composable.deleteBookmark(bookmark.id, false);
      });

      describe('when the showMessage value is false', () => {
        it('does not call the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).not.toHaveBeenCalled();
        });
      });

      describe('when the showMessage value is true', () => {
        beforeEach(() => {
          composable.deleteBookmark(bookmark.id);
        });

        it('calls the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).toHaveBeenCalledWith(
            'Successfully deleted bookmark.',
          );
        });
      });
    });
  });

  describe('when the resetBookmarks function is called', () => {
    beforeEach(() => {
      composable.resetBookmarks();
    });

    it('sets the bookmarks value to the default value', () => {
      expect(composable.bookmarks.value).toEqual([]);
    });
  });

  describe('when the getBookmarkPosition function is called', () => {
    describe('when a bookmark with the given id exists', () => {
      beforeEach(() => {
        composable.bookmarks.value = bookmarksMock;
      });

      it('returns the correct response', () => {
        expect(composable.getBookmarkPosition(bookmark.id)).toBe(123);
      });
    });

    describe('when no bookmark with the given id exists', () => {
      beforeEach(() => {
        composable.bookmarks.value = [];
      });

      it('returns the correct response', () => {
        expect(
          composable.getBookmarkPosition('non-existent-id'),
        ).toBeUndefined();
      });
    });
  });
});
