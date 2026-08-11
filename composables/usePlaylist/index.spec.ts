import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import {
  getFormattedPlaylistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import { usePlaylist } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

const addSuccessSnackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSnack', (original) => () => ({
  ...original(),
  addSuccessSnack: addSuccessSnackMock,
}));

const openModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useModal', (original) => () => ({
  ...original(),
  openModal: (...args: unknown[]) => openModalMock(...args),
}));

const playlistsMock = getFormattedPlaylistsMock(2);
const playlistMock = playlistsMock[0];
const reorderPlaylist = getFormattedPlaylistsMock(1, {
  tracks: getFormattedTracksMock(4),
})[0];

describe('usePlaylist', () => {
  let composable: ReturnType<typeof usePlaylist>;

  beforeAll(() => {
    composable = usePlaylist();
  });

  it('sets the default playlists value', () => {
    expect(composable.playlists.value).toEqual([]);
  });

  it('sets the default playlist value', () => {
    expect(composable.playlist.value).toBeNull();
  });

  describe('when the getPlaylists function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeAll(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        composable.getPlaylists();
      });

      it('does not add to the playlists value', () => {
        expect(composable.playlists.value).toEqual([]);
      });
    });

    describe('when fetchData response returns a value', () => {
      describe('when fetchData response returns a non array value', () => {
        beforeAll(() => {
          fetchDataMock.mockResolvedValue({
            data: {},
          });

          composable.getPlaylists();
        });

        it('does not add to the playlists value', () => {
          expect(composable.playlists.value).toEqual([]);
        });
      });

      describe('when fetchData response returns an array value', () => {
        beforeAll(async () => {
          fetchDataMock.mockResolvedValue({
            data: [
              {
                name: 'name',
              },
            ],
          });

          await composable.getPlaylists();
        });

        it('adds to the playlists value', () => {
          expect(composable.playlists.value).toEqual([
            RANDOM_PLAYLIST,
            {
              name: 'name',
            },
          ]);
        });
      });
    });
  });

  describe('when the loadPlaylistTracksById function is called', () => {
    describe('when id is not set', () => {
      beforeAll(() => {
        composable.loadPlaylistTracksById();
      });

      it('calls the fetchRandomPlaylist function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getRandomSongs',
          expect.any(Object),
        );
      });

      describe('when fetchData response returns null', () => {
        beforeAll(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });

          composable.loadPlaylistTracksById();
        });

        it('sets the correct playlist value', () => {
          expect(composable.playlist.value).toBeNull();
        });
      });

      describe('when fetchData response returns a value', () => {
        beforeAll(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              name: 'name',
            },
          });

          composable.loadPlaylistTracksById();
        });

        it('sets the correct playlist value', () => {
          expect(composable.playlist.value).toEqual({
            name: 'name',
          });
        });
      });
    });

    describe('when id is set', () => {
      beforeAll(() => {
        composable.loadPlaylistTracksById('playlistId');
      });

      it('calls the fetchPlaylist function with the correct parameters', () => {
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
        beforeAll(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });

          composable.loadPlaylistTracksById('playlistId', false);
        });

        it('sets the correct playlist value', () => {
          expect(composable.playlist.value).toBeNull();
        });
      });

      describe('when fetchData response returns a value', () => {
        beforeAll(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              name: 'name',
            },
          });

          composable.loadPlaylistTracksById('playlistId');
        });

        it('sets the correct playlist value', () => {
          expect(composable.playlist.value).toEqual({
            name: 'name',
          });
        });
      });
    });
  });

  describe('when the addPlaylist function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();

      fetchDataMock.mockResolvedValue({
        data: null,
      });

      composable.addPlaylist({
        name: 'name',
      });
    });

    it('calls the getPlaylists function with the correct parameters', () => {
      expect(fetchDataMock).toHaveBeenCalledWith(
        '/getPlaylists',
        expect.any(Object),
      );
    });

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeAll(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        composable.addPlaylist({
          name: 'name',
        });
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added playlist name.',
        );
      });
    });
  });

  describe('when the updatePlaylist function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();

      fetchDataMock.mockResolvedValue({
        data: null,
      });

      composable.updatePlaylist({} as PlaylistParam);
    });

    it('calls the getPlaylists function with the correct parameters', () => {
      expect(fetchDataMock).toHaveBeenCalledWith(
        '/getPlaylists',
        expect.any(Object),
      );
    });

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeAll(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        composable.updatePlaylist({} as PlaylistParam);
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
          beforeAll(() => {
            composable.updatePlaylist({} as PlaylistParam, 'Success message');
          });

          it('calls the addSuccessSnack function with the correct parameters', () => {
            expect(addSuccessSnackMock).toHaveBeenCalledWith('Success message');
          });
        });
      });

      describe('when showMessage parameter is false', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          composable.updatePlaylist(
            {} as PlaylistParam,
            'Success message',
            false,
          );
        });

        it('does not call the addSuccessSnack function', () => {
          expect(addSuccessSnackMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the deletePlaylist function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();

      fetchDataMock.mockResolvedValue({
        data: null,
      });

      composable.deletePlaylist('id');
    });

    it('calls the getPlaylists function with the correct parameters', () => {
      expect(fetchDataMock).toHaveBeenCalledWith(
        '/getPlaylists',
        expect.any(Object),
      );
    });

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeAll(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        composable.deletePlaylist('id');
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted playlist.',
        );
      });
    });
  });

  describe('when the addToPlaylist function is called', () => {
    describe('when fetchPlaylistTracks is true', () => {
      beforeAll(async () => {
        await composable.addToPlaylist({
          playlistId: 'playlistId',
        });
      });

      it('calls the updatePlaylist function with the correct Id', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updatePlaylist',
          expect.any(Object),
        );
      });

      it('calls the loadPlaylistTracksById function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });

    describe('when fetchPlaylistTracks is false', () => {
      beforeAll(async () => {
        vi.clearAllMocks();

        await composable.addToPlaylist(
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

      it('does not call the loadPlaylistTracksById function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the removeFromPlaylist function is called', () => {
    describe('when fetchPlaylistTracks is true', () => {
      beforeAll(async () => {
        await composable.removeFromPlaylist({
          playlistId: 'playlistId',
        });
      });

      it('calls the updatePlaylist function with the correct Id', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updatePlaylist',
          expect.any(Object),
        );
      });

      it('calls the loadPlaylistTracksById function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });

    describe('when fetchPlaylistTracks is false', () => {
      beforeAll(async () => {
        vi.clearAllMocks();

        await composable.removeFromPlaylist(
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

      it('does not call the loadPlaylistTracksById function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPlaylist',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the addToPlaylistModal function is called', () => {
    let handlers: Record<string, (...args: unknown[]) => Promise<void> | Ref>;

    beforeAll(() => {
      composable.addToPlaylistModal('trackId', 6);
      handlers = openModalMock.mock.calls[0][1];
    });

    it('calls the openModal function with the correct parameters', () => {
      expect(openModalMock).toHaveBeenCalledWith(
        MODAL_TYPE.addToPlaylistModal,
        {
          loading: expect.any(Object),
          newlyCreatedPlaylistId: expect.any(Object),
          onAddToPlaylist: expect.any(Function),
          onRemoveFromPlaylist: expect.any(Function),
          onSubmit: expect.any(Function),
          playlists: expect.any(Object),
        },
      );
    });

    describe('when the onAddToPlaylist function is called', () => {
      beforeAll(() => {
        composable.playlist.value = playlistMock;
      });

      describe('when playlist matches current playlist', () => {
        beforeAll(async () => {
          await handlers.onAddToPlaylist(playlistMock.id);
        });

        it('calls the updatePlaylist function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/updatePlaylist',
            expect.any(Object),
          );
        });

        it('calls the loadPlaylistTracksById function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/getPlaylist',
            expect.any(Object),
          );
        });
      });

      describe('when playlist does not match current playlist', () => {
        beforeAll(async () => {
          vi.clearAllMocks();
          await handlers.onAddToPlaylist('id');
        });

        it('calls the updatePlaylist function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/updatePlaylist',
            expect.any(Object),
          );
        });

        it('does not call the loadPlaylistTracksById function', () => {
          expect(fetchDataMock).not.toHaveBeenCalledWith(
            '/getPlaylist',
            expect.any(Object),
          );
        });
      });
    });

    describe('when the onRemoveFromPlaylist function is called', () => {
      beforeAll(() => {
        composable.playlists.value = playlistsMock;
        composable.playlist.value = playlistMock;
      });

      describe('when playlist is not found', () => {
        beforeAll(async () => {
          vi.clearAllMocks();

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
          beforeAll(async () => {
            vi.clearAllMocks();

            await handlers.onRemoveFromPlaylist(playlistMock.id);
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

          it('calls the loadPlaylistTracksById function with the correct parameters', () => {
            expect(fetchDataMock).toHaveBeenCalledWith(
              '/getPlaylist',
              expect.any(Object),
            );
          });
        });

        describe('when playlist does not match current playlist', () => {
          beforeAll(async () => {
            vi.clearAllMocks();

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

          it('does not call the loadPlaylistTracksById function', () => {
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
        beforeAll(async () => {
          vi.clearAllMocks();

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
          beforeAll(async () => {
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
          beforeAll(async () => {
            fetchDataMock.mockResolvedValue({
              data: {
                id: 'id',
              },
            });

            await handlers.onSubmit('playlistName');
          });

          it('calls the createPlaylist function with the correct parameters', () => {
            expect(fetchDataMock).toHaveBeenCalledWith('/createPlaylist', {
              method: 'POST',
              query: {
                name: 'playlistName',
                songId: 'trackId',
              },
              transform: expect.any(Function),
            });
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

  describe('when the reorderPlaylistTracks function is called', () => {
    beforeAll(() => {
      composable.playlist.value = {
        ...reorderPlaylist,
        tracks: [...reorderPlaylist.tracks],
      };
    });

    describe('when moving the selected track forward', () => {
      beforeAll(async () => {
        await composable.reorderPlaylistTracks('playlist-123', 0, 2);
      });

      it('sets the correct playlist tracks value', () => {
        expect(composable.playlist.value!.tracks).toEqual([
          reorderPlaylist.tracks[1],
          reorderPlaylist.tracks[2],
          reorderPlaylist.tracks[0],
          reorderPlaylist.tracks[3],
        ]);
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/createPlaylist', {
          method: 'POST',
          query: {
            playlistId: 'playlist-123',
            songId: [
              reorderPlaylist.tracks[1].id,
              reorderPlaylist.tracks[2].id,
              reorderPlaylist.tracks[0].id,
              reorderPlaylist.tracks[3].id,
            ],
          },
        });
      });
    });

    describe('when moving the selected track backward', () => {
      beforeAll(async () => {
        await composable.reorderPlaylistTracks('playlist-123', 3, 1);
      });

      it('sets the correct playlist tracks value', () => {
        expect(composable.playlist.value!.tracks).toEqual([
          reorderPlaylist.tracks[1],
          reorderPlaylist.tracks[3],
          reorderPlaylist.tracks[2],
          reorderPlaylist.tracks[0],
        ]);
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/createPlaylist', {
          method: 'POST',
          query: {
            playlistId: 'playlist-123',
            songId: [
              reorderPlaylist.tracks[1].id,
              reorderPlaylist.tracks[3].id,
              reorderPlaylist.tracks[2].id,
              reorderPlaylist.tracks[0].id,
            ],
          },
        });
      });
    });

    describe('when the provided indices are equal', () => {
      beforeAll(async () => {
        vi.clearAllMocks();

        await composable.reorderPlaylistTracks('playlist-123', 1, 1);
      });

      it('does not update the playlist tracks value', () => {
        expect(composable.playlist.value!.tracks).toEqual([
          reorderPlaylist.tracks[1],
          reorderPlaylist.tracks[3],
          reorderPlaylist.tracks[2],
          reorderPlaylist.tracks[0],
        ]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });

    describe('when an invalid fromIndex is provided', () => {
      beforeAll(async () => {
        await composable.reorderPlaylistTracks('playlist-123', -1, 0);
      });

      it('does not update the playlist tracks value', () => {
        expect(composable.playlist.value!.tracks).toEqual([
          reorderPlaylist.tracks[1],
          reorderPlaylist.tracks[3],
          reorderPlaylist.tracks[2],
          reorderPlaylist.tracks[0],
        ]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });

    describe('when an invalid toIndex is provided', () => {
      beforeAll(async () => {
        await composable.reorderPlaylistTracks('playlist-123', 0, 5);
      });

      it('does not update the playlist tracks value', () => {
        expect(composable.playlist.value!.tracks).toEqual([
          reorderPlaylist.tracks[1],
          reorderPlaylist.tracks[3],
          reorderPlaylist.tracks[2],
          reorderPlaylist.tracks[0],
        ]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });

    describe('when the playlist value is null', () => {
      beforeAll(async () => {
        composable.playlist.value = null;
        await composable.reorderPlaylistTracks('playlist-123', 0, 1);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the resetPlaylists function is called', () => {
    beforeAll(() => {
      composable.resetPlaylists();
    });

    it('sets the playlist value to the default value', () => {
      expect(composable.playlist.value).toBeNull();
    });

    it('sets the playlists value to the default value', () => {
      expect(composable.playlists.value).toEqual([]);
    });
  });
});
