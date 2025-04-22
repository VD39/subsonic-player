import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { usePlaylist } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const addSuccessSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addSuccessSnack: addSuccessSnackMock,
}));

const {
  addPlaylist,
  deletePlaylist,
  getPlaylists,
  getPlaylistTracksById,
  playlist,
  playlists,
  updatePlaylist,
} = usePlaylist();

describe('usePlaylist', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default playlists value', () => {
    expect(playlists.value).toEqual([]);
  });

  it('sets the default playlist value', () => {
    expect(playlist.value).toEqual(null);
  });

  describe('when the getPlaylists function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getPlaylists();
      });

      it('does not add to the playlists value', () => {
        expect(playlists.value).toEqual([]);
      });
    });

    describe('when fetchData response returns a value', () => {
      describe('when fetchData response returns a non array value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {},
          });

          getPlaylists();
        });

        it('does not add to the playlists value', () => {
          expect(playlists.value).toEqual([]);
        });
      });

      describe('when fetchData response returns an array value', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: [
              {
                name: 'name',
              },
            ],
          });

          await getPlaylists();
        });

        it('adds to the playlists value', () => {
          expect(playlists.value).toEqual([
            RANDOM_PLAYLIST,
            {
              name: 'name',
            },
          ]);
        });
      });
    });
  });

  describe('when the getPlaylistTracksById function is called', () => {
    describe('when id is not set', () => {
      beforeEach(() => {
        getPlaylistTracksById();
      });

      it('calls the fetchData with the correct path', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getRandomSongs',
          expect.any(Object),
        );
      });

      describe('when fetchData response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });

          getPlaylistTracksById();
        });

        it('sets the correct playlist value', () => {
          expect(playlist.value).toEqual(null);
        });
      });

      describe('when fetchData response returns a value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              name: 'name',
            },
          });

          getPlaylistTracksById();
        });

        it('sets the correct playlist value', () => {
          expect(playlist.value).toEqual({
            name: 'name',
          });
        });
      });
    });

    describe('when id is set', () => {
      beforeEach(() => {
        getPlaylistTracksById('playlistId');
      });

      it('calls the fetchData with the correct path', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylist',
          expect.objectContaining({
            params: {
              id: 'playlistId',
            },
          }),
        );
      });

      describe('when fetchData response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });

          getPlaylistTracksById('playlistId', false);
        });

        it('sets the correct playlist value', () => {
          expect(playlist.value).toEqual(null);
        });
      });

      describe('when fetchData response returns a value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              name: 'name',
            },
          });

          getPlaylistTracksById('playlistId');
        });

        it('sets the correct playlist value', () => {
          expect(playlist.value).toEqual({
            name: 'name',
          });
        });
      });
    });
  });

  describe('when the addPlaylist function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        addPlaylist('name');
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

        addPlaylist('name');
      });

      it('calls the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added playlist name.',
        );
      });
    });
  });

  describe('when the updatePlaylist function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        updatePlaylist({} as PlaylistParam);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getPlaylists function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylists',
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

        updatePlaylist({} as PlaylistParam);
      });

      it('calls the getPlaylists function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylists',
          expect.any(Object),
        );
      });

      describe('when success message is not set', () => {
        it('calls the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).toHaveBeenCalledWith(
            'Successfully updated playlist.',
          );
        });
      });

      describe('when success message is set', () => {
        beforeEach(() => {
          updatePlaylist({} as PlaylistParam, 'Success message');
        });

        it('calls the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).toHaveBeenCalledWith('Success message');
        });
      });
    });
  });

  describe('when the deletePlaylist function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        deletePlaylist('id');
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getPlaylists function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylists',
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

        deletePlaylist('id');
      });

      it('calls the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted playlist.',
        );
      });

      it('calls the getPlaylists function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylists',
          expect.any(Object),
        );
      });
    });
  });
});
