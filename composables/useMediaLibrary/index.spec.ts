import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { getFormattedTracksMock } from '@/test/helpers';

import { useMediaLibrary } from './index';

const windowLocationAssignSpy = vi.spyOn(globalThis.location, 'assign');

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
  downloadTrack,
  getIndexes,
  getMediaLibraryContent,
  getMusicDirectory,
  getMusicFolders,
  startScan,
} = useMediaLibrary();

const track = getFormattedTracksMock()[0];

describe('useMediaLibrary', () => {
  describe('when the downloadTrack function is called', () => {
    describe('when the track does not have a streamUrlId property', () => {
      beforeEach(() => {
        downloadTrack({
          ...track,
          streamUrlId: '',
        });
      });

      it('does not call the window.location.assign function', () => {
        expect(windowLocationAssignSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the track has a streamUrlId property', () => {
      beforeEach(() => {
        downloadTrack(track);
      });

      it('calls the window.location.assign with the correct value', () => {
        expect(windowLocationAssignSpy).toHaveBeenCalledWith(track.streamUrlId);
      });
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

      it('does not call the addSuccessSnack function', () => {
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

      it('calls the addSuccessSnack function with the correct parameters', () => {
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

  describe('when the getMediaLibraryContent function is called', () => {
    describe('without and id or slug parameter', () => {
      beforeEach(() => {
        getMediaLibraryContent();
      });

      it('calls the getMusicFolders function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getMusicFolders', {
          transform: expect.any(Function),
        });
      });
    });

    describe('with an id parameter', () => {
      beforeEach(() => {
        getMediaLibraryContent({
          id: 'id',
        });
      });

      it('calls the getIndexes function with correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getIndexes', {
          query: {
            musicFolderId: 'id',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('with a slug parameter', () => {
      beforeEach(() => {
        getMediaLibraryContent({
          slug: ['slug1', 'slug2', 'slug3'],
        });
      });

      it('calls the getMusicDirectory function with correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getMusicDirectory', {
          query: {
            id: 'slug3',
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('with an id and slug parameter', () => {
      beforeEach(() => {
        getMediaLibraryContent({
          id: 'id1',
          slug: ['slug1', 'slug2'],
        });
      });

      it('calls the getMusicDirectory function with correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getMusicDirectory', {
          query: {
            id: 'slug2',
          },
          transform: expect.any(Function),
        });
      });
    });
  });
});
