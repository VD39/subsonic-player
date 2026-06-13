import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { getFormattedBookmarksMock } from '@/test/helpers';

import { useBookmark } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
  getDownloadUrl: vi.fn((path) => path),
}));

const addSuccessSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addSuccessSnack: addSuccessSnackMock,
}));

const {
  bookmarks,
  createBookmark,
  deleteBookmark,
  getBookmarkPosition,
  getBookmarks,
  resetBookmarks,
} = useBookmark();

const bookmarksMock = getFormattedBookmarksMock(3, {
  position: 123,
});
const bookmark = bookmarksMock[0];

describe('useBookmark', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default bookmarks value', () => {
    expect(bookmarks.value).toEqual([]);
  });

  describe('when the getBookmarks function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await getBookmarks();
      });

      it('sets the correct bookmarks value', () => {
        expect(bookmarks.value).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: bookmarksMock,
        });

        await getBookmarks();
      });

      it('sets the correct bookmarks value', () => {
        expect(bookmarks.value).toEqual(bookmarksMock);
      });
    });
  });

  describe('when the createBookmark function is called', () => {
    beforeEach(() => {
      createBookmark(bookmark.id, 12345);
    });

    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        createBookmark(bookmark.id, 12345);
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

      deleteBookmark(bookmark.id);
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

        deleteBookmark(bookmark.id, false);
      });

      describe('when showMessage is false', () => {
        it('does not call the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).not.toHaveBeenCalled();
        });
      });

      describe('when showMessage is true', () => {
        beforeEach(() => {
          deleteBookmark(bookmark.id);
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
      resetBookmarks();
    });

    it('sets the bookmarks value to the default value', () => {
      expect(bookmarks.value).toEqual([]);
    });
  });

  describe('when the getBookmarkPosition function is called', () => {
    describe('when a bookmark with the given id exists', () => {
      beforeEach(() => {
        bookmarks.value = bookmarksMock;
      });

      it('returns the correct response', () => {
        expect(getBookmarkPosition(bookmark.id)).toBe(123);
      });
    });

    describe('when no bookmark with the given id exists', () => {
      beforeEach(() => {
        bookmarks.value = [];
      });

      it('returns the correct response', () => {
        expect(getBookmarkPosition('non-existent-id')).toBeUndefined();
      });
    });
  });
});
