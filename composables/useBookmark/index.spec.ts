import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

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

const { bookmarks, createBookmark, deleteBookmark, getBookmarks } =
  useBookmark();

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
          data: [
            {
              name: 'name',
            },
          ],
        });

        await getBookmarks();
      });

      it('sets the correct bookmarks value', () => {
        expect(bookmarks.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the createBookmark function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        createBookmark('id', 12345);
      });

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getBookmarks function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getBookmarks',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        createBookmark('id', 12345);
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
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        deleteBookmark('id');
      });

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getBookmarks function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getBookmarks',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        deleteBookmark('id', false);
      });

      it('calls the getBookmarks function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getBookmarks',
          expect.any(Object),
        );
      });

      describe('when showMessage is false', () => {
        it('does not call the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).not.toHaveBeenCalled();
        });
      });

      describe('when showMessage is true', () => {
        beforeEach(() => {
          deleteBookmark('id');
        });

        it('calls the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).toHaveBeenCalledWith(
            'Successfully deleted bookmark.',
          );
        });
      });
    });
  });
});
