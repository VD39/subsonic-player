import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { getFormattedPlaylistsMock } from '~/test/helpers';

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

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: (...args: unknown[]) => openModalMock(...args),
}));

const {
  addPlaylist,
  addToPlaylist,
  addToPlaylistModal,
  deletePlaylist,
  getPlaylists,
  getPlaylistTracksById,
  playlist,
  playlists,
  removeFromPlaylist,
  updatePlaylist,
} = usePlaylist();

const playlistsMock = getFormattedPlaylistsMock(2);

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

      it('calls the getRandomTracks function with the correct parameters', () => {
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

      it('calls the getPlaylistTracks function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylist',
          expect.objectContaining({
            query: {
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

      it('does not call the getPlaylists function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylists',
          expect.any(Object),
        );
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

        addPlaylist('name');
      });

      it('calls the getPlaylists function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylists',
          expect.any(Object),
        );
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
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

      it('does not call the addSuccessSnack function', () => {
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

      it('calls the getPlaylists function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylists',
          expect.any(Object),
        );
      });

      describe('when showMessage parameter is true', () => {
        describe('when success message is not set', () => {
          it('calls the addSuccessSnack function with the correct parameters', () => {
            expect(addSuccessSnackMock).toHaveBeenCalledWith(
              'Successfully updated playlist.',
            );
          });
        });

        describe('when success message is set', () => {
          beforeEach(() => {
            updatePlaylist({} as PlaylistParam, 'Success message');
          });

          it('calls the addSuccessSnack function with the correct parameters', () => {
            expect(addSuccessSnackMock).toHaveBeenCalledWith('Success message');
          });
        });
      });

      describe('when showMessage parameter is false', () => {
        beforeEach(() => {
          vi.clearAllMocks();
          updatePlaylist({} as PlaylistParam, 'Success message', false);
        });

        it('does not call the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).not.toHaveBeenCalled();
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

      it('does not call the addSuccessSnack function', () => {
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

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted playlist.',
        );
      });

      it('calls the getPlaylists function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylists',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the addToPlaylist function is called', () => {
    describe('when fetchPlaylistTracks is true', () => {
      beforeEach(async () => {
        await addToPlaylist({
          playlistId: 'playlistId',
        });
      });

      it('calls the updatePlaylist function with the correct Id', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updatePlaylist',
          expect.any(Object),
        );
      });

      it('calls the getPlaylistTracksById function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });

    describe('when fetchPlaylistTracks is false', () => {
      beforeEach(async () => {
        await addToPlaylist(
          {
            playlistId: 'playlistId',
          },
          false,
        );
      });

      it('calls the updatePlaylist function with the correct Id', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updatePlaylist',
          expect.any(Object),
        );
      });

      it('does not call getPlaylistTracksById function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the removeFromPlaylist function is called', () => {
    describe('when fetchPlaylistTracks is true', () => {
      beforeEach(async () => {
        await removeFromPlaylist({
          playlistId: 'playlistId',
        });
      });

      it('calls the updatePlaylist function with the correct Id', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updatePlaylist',
          expect.any(Object),
        );
      });

      it('calls the getPlaylistTracksById function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });

    describe('when fetchPlaylistTracks is false', () => {
      beforeEach(async () => {
        await removeFromPlaylist(
          {
            playlistId: 'playlistId',
          },
          false,
        );
      });

      it('calls the updatePlaylist function with the correct Id', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updatePlaylist',
          expect.any(Object),
        );
      });

      it('does not call getPlaylistTracksById function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the addToPlaylistModal function is called', () => {
    let handlers: Record<string, (...args: unknown[]) => Promise<void> | Ref>;

    beforeEach(() => {
      addToPlaylistModal('trackId', 6);
      handlers = openModalMock.mock.calls[0][1];
    });

    it('calls openModal with correct modal type and handlers', () => {
      expect(openModalMock).toHaveBeenCalled();
    });

    describe('when the onAddToPlaylist function is called', () => {
      beforeEach(() => {
        playlist.value = playlistsMock[0];
      });

      describe('when playlist matches current playlist', () => {
        beforeEach(async () => {
          await handlers.onAddToPlaylist(playlistsMock[0].id);
        });

        it('calls the updatePlaylist function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/updatePlaylist',
            expect.any(Object),
          );
        });

        it('calls the getPlaylistTracksById function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/getPlaylist',
            expect.any(Object),
          );
        });
      });

      describe('when playlist does not match current playlist', () => {
        beforeEach(async () => {
          await handlers.onAddToPlaylist('id');
        });

        it('calls the updatePlaylist function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/updatePlaylist',
            expect.any(Object),
          );
        });

        it('does not call getPlaylistTracksById function', () => {
          expect(fetchDataMock).not.toHaveBeenCalledWith(
            '/getPlaylist',
            expect.any(Object),
          );
        });
      });
    });

    describe('when the onRemoveFromPlaylist function is called', () => {
      beforeEach(() => {
        playlists.value = playlistsMock;
        playlist.value = playlistsMock[0];
      });

      describe('when playlist is not found', () => {
        beforeEach(async () => {
          await handlers.onRemoveFromPlaylist('id');
        });

        it('does not call the removeFromPlaylist function', () => {
          expect(fetchDataMock).not.toHaveBeenCalledWith(
            '/updatePlaylist',
            expect.any(Object),
          );
        });
      });

      describe('when playlist is found', () => {
        describe('when playlist matches current playlist', () => {
          beforeEach(async () => {
            await handlers.onRemoveFromPlaylist(playlistsMock[0].id);
          });

          it('calls the updatePlaylist function with the correct Id', () => {
            expect(fetchDataMock).toHaveBeenCalledWith(
              '/updatePlaylist',
              expect.objectContaining({
                query: expect.objectContaining({
                  songIndexToRemove: 6,
                }),
              }),
            );
          });

          it('calls the getPlaylistTracksById function with the correct parameters', () => {
            expect(fetchDataMock).toHaveBeenCalledWith(
              '/getPlaylist',
              expect.any(Object),
            );
          });
        });

        describe('when playlist does not match current playlist', () => {
          beforeEach(async () => {
            await handlers.onRemoveFromPlaylist(playlistsMock[1].id);
          });

          it('calls the updatePlaylist function with the correct Id', () => {
            expect(fetchDataMock).toHaveBeenCalledWith(
              '/updatePlaylist',
              expect.objectContaining({
                query: expect.objectContaining({
                  songIndexToRemove: 0,
                }),
              }),
            );
          });

          it('does not call getPlaylistTracksById function', () => {
            expect(fetchDataMock).not.toHaveBeenCalledWith(
              '/getPlaylist',
              expect.any(Object),
            );
          });
        });
      });
    });

    describe('when the onSubmit function is called', () => {
      describe('when fetchData response returns null', () => {
        beforeEach(async () => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });

          await handlers.onSubmit('playlistName');
        });

        it('does not call the updatePlaylist function', () => {
          expect(fetchDataMock).not.toHaveBeenCalledWith(
            '/updatePlaylist',
            expect.any(Object),
          );
        });
      });

      describe('when fetchData response returns a value', () => {
        describe('when fetchData response returns no id', () => {
          beforeEach(async () => {
            fetchDataMock.mockResolvedValue({
              data: {
                id: null,
              },
            });

            await handlers.onSubmit('playlistName');
          });

          it('does not call the updatePlaylist function', () => {
            expect(fetchDataMock).not.toHaveBeenCalledWith(
              '/updatePlaylist',
              expect.any(Object),
            );
          });

          it('sets the correct newlyCreatedPlaylistId value', () => {
            expect(handlers.newlyCreatedPlaylistId).toEqual(
              expect.objectContaining({
                value: null,
              }),
            );
          });
        });

        describe('when fetchData response returns an id', () => {
          beforeEach(async () => {
            fetchDataMock.mockResolvedValue({
              data: {
                id: 'id',
              },
            });

            await handlers.onSubmit('playlistName');
          });

          it('calls the updatePlaylist function with the correct parameters', () => {
            expect(fetchDataMock).toHaveBeenCalledWith(
              '/updatePlaylist',
              expect.any(Object),
            );
          });

          it('sets the correct newlyCreatedPlaylistId value', () => {
            expect(handlers.newlyCreatedPlaylistId).toEqual(
              expect.objectContaining({
                value: 'id',
              }),
            );
          });
        });
      });
    });
  });
});
