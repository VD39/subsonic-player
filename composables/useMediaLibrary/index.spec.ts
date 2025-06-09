import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useMediaLibrary } from './index';

const windowLocationAssignSpy = vi.spyOn(window.location, 'assign');

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
  downloadMedia,
  getFiles,
  getIndexes,
  getMusicDirectory,
  getMusicFolders,
  startScan,
} = useMediaLibrary();

describe('useMediaLibrary', () => {
  describe('when the downloadMedia function is called', () => {
    beforeEach(() => {
      downloadMedia('download-id');
    });

    it('calls the window.location.assign with the correct value', () => {
      expect(windowLocationAssignSpy).toHaveBeenCalledWith('download-id');
    });
  });

  describe('when the startScan function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        startScan();
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        startScan();
      });

      it('calls the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith('Scan started.');
      });
    });
  });

  describe.each([
    ['getIndexes', getIndexes],
    ['getMusicDirectory', getMusicDirectory],
    ['getMusicFolders', getMusicFolders],
  ])('when the %s function is called', (_functionName, action) => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await action('id')).toEqual(DEFAULT_MEDIA_LIBRARY);
      });
    });

    describe('when fetchData response returns a success response', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await action('id')).toEqual({
          name: 'name',
        });
      });
    });
  });

  describe('when the getFiles function is called', () => {
    describe('without and id or slug parameter', () => {
      beforeEach(() => {
        getFiles();
      });

      it('calls the getMusicFolders function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getMusicFolders', {
          transform: expect.any(Function),
        });
      });
    });

    describe('with an id parameter', () => {
      beforeEach(() => {
        getFiles({
          id: 'id',
        });
      });

      it('calls the getIndexes function with correct params', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getIndexes', {
          params: {
            musicFolderId: 'id',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('with a slug parameter', () => {
      beforeEach(() => {
        getFiles({
          slug: ['slug1', 'slug2', 'slug3'],
        });
      });

      it('calls the getMusicDirectory function with correct params', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getMusicDirectory', {
          params: {
            id: 'slug3',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('with an id and slug parameter', () => {
      beforeEach(() => {
        getFiles({
          id: 'id1',
          slug: ['slug1', 'slug2'],
        });
      });

      it('calls the getMusicDirectory function with correct params', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getMusicDirectory', {
          params: {
            id: 'slug2',
          },
          transform: expect.any(Function),
        });
      });
    });
  });
});
