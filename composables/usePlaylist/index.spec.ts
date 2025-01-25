import type { DataMock } from '@/test/types';

import { withSetup } from '@/test/withSetup';
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

describe('usePlaylist', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof usePlaylist>>>;

  beforeEach(() => {
    result = withSetup(usePlaylist);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default playlists value', () => {
    expect(result.composable.playlists.value).toEqual([]);
  });

  describe('when the getPlaylists function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        result = withSetup(usePlaylist);
        result.composable.getPlaylists();
      });

      it('does not add to the playlists value', () => {
        expect(result.composable.playlists.value).toEqual([]);
      });
    });

    describe('when fetchData response returns a value', () => {
      describe('when fetchData response returns a non array value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {},
          });

          result.composable.getPlaylists();
        });

        it('does not add to the playlists value', () => {
          expect(result.composable.playlists.value).toEqual([]);
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

          await result.composable.getPlaylists();
        });

        it('adds to the playlists value', () => {
          expect(result.composable.playlists.value).toEqual([
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
        result = withSetup(usePlaylist);
        result.composable.getPlaylistTracksById();
      });

      it('calls the fetchData with the correct path', () => {
        expect(fetchDataMock).toBeCalledWith(
          '/getRandomSongs',
          expect.any(Object),
        );
      });

      describe('when fetchData response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });
        });

        it('returns the correct response', async () => {
          expect(await result.composable.getPlaylistTracksById()).toEqual(null);
        });
      });

      describe('when fetchData response returns a value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              name: 'name',
            },
          });
        });

        it('returns the correct response', async () => {
          expect(await result.composable.getPlaylistTracksById()).toEqual({
            name: 'name',
          });
        });
      });
    });

    describe('when id is set', () => {
      beforeEach(() => {
        result = withSetup(usePlaylist);
        result.composable.getPlaylistTracksById('playlistId');
      });

      it('calls the fetchData with the correct path', () => {
        expect(fetchDataMock).toBeCalledWith(
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
        });

        it('returns the correct response', async () => {
          expect(
            await result.composable.getPlaylistTracksById('playlistId'),
          ).toEqual(null);
        });
      });

      describe('when fetchData response returns a value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              name: 'name',
            },
          });
        });

        it('returns the correct response', async () => {
          expect(
            await result.composable.getPlaylistTracksById('playlistId'),
          ).toEqual({
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

        result = withSetup(usePlaylist);
        result.composable.addPlaylist('name');
      });

      it('does not add to the playlists value', () => {
        expect(result.composable.playlists.value).toEqual([
          RANDOM_PLAYLIST,
          {
            name: 'name',
          },
        ]);
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

        result.composable.addPlaylist('name');
      });

      it('adds to the playlists value', () => {
        expect(result.composable.playlists.value).toEqual([
          RANDOM_PLAYLIST,
          {
            name: 'name',
          },
          {
            name: 'name',
          },
        ]);
      });

      it('calls the addSuccessSnackMock function', () => {
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

        result = withSetup(usePlaylist);
        result.composable.updatePlaylist({} as PlaylistParam);
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
      });

      describe('when success message is not set', () => {
        beforeEach(() => {
          result.composable.updatePlaylist({} as PlaylistParam);
        });

        it('calls the addSuccessSnackMock function', () => {
          expect(addSuccessSnackMock).toHaveBeenCalledWith(
            'Successfully updated playlist.',
          );
        });
      });

      describe('when success message is set', () => {
        beforeEach(() => {
          result.composable.updatePlaylist(
            {} as PlaylistParam,
            'Success message',
          );
        });

        it('calls the addSuccessSnackMock function', () => {
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

        result = withSetup(usePlaylist);
        result.composable.deletePlaylist('id');
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

        result.composable.deletePlaylist('id');
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted playlist.',
        );
      });
    });
  });
});
