import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { withSetup } from '@/test/withSetup';
import { usePlaylist } from './index';

const fetchDataMock = vi.fn(() => ({
  data: ref<null | Playlist | Playlist[]>(null),
  error: ref<null | Error>(null),
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const addErrorSnackMock = vi.fn();
const addSuccessSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addErrorSnack: addErrorSnackMock,
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

  it('sets the default playlist value', () => {
    expect(result.playlist.value).toEqual(null);
  });

  it('sets the default playlists value', () => {
    expect(result.playlists.value).toEqual([]);
  });

  describe('when the getPlaylists function is called', () => {
    describe('when fetchData response is successful', () => {
      describe('when response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: ref(null),
            error: ref(null),
          });

          result = withSetup(usePlaylist);
          result.getPlaylists();
        });

        it('does not add to the playlists value', () => {
          expect(result.playlists.value).toEqual([]);
        });

        it('does not call the addErrorSnack function', () => {
          expect(addErrorSnackMock).not.toHaveBeenCalled();
        });
      });

      describe('when response returns a value', () => {
        describe('when response returns a non array value', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref({} as Playlist),
              error: ref(null),
            });

            result.getPlaylists();
          });

          it('does not add to the playlists value', () => {
            expect(result.playlists.value).toEqual([]);
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });

        describe('when response returns an array value', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref([
                {
                  name: 'name',
                } as Playlist,
              ]),
              error: ref(null),
            });

            result.getPlaylists();
          });

          it('adds to the playlists value', () => {
            expect(result.playlists.value).toEqual([
              {
                name: 'name',
              },
            ]);
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when fetchData response is not successful', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: ref(null),
          error: ref(new Error('Error message.')),
        });

        result.getPlaylists();
      });

      it('does not add to the playlists value', () => {
        expect(result.playlists.value).toEqual([]);
      });

      it('calls the addErrorSnack function', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith('Error message.');
      });
    });
  });

  describe('when the getPlaylistById function is called', () => {
    describe('when id is not set', () => {
      beforeEach(() => {
        result = withSetup(usePlaylist);
        result.getPlaylistById();
      });

      it('calls the fetchData with the correct path', () => {
        expect(fetchDataMock).toBeCalledWith(
          '/getRandomSongs',
          expect.any(Object),
        );
      });

      describe('when fetchData response is successful', () => {
        describe('when response returns null', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref(null),
              error: ref(null),
            });

            result.getPlaylistById();
          });

          it('sets the playlist value', () => {
            expect(result.playlist.value).toEqual(null);
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });

        describe('when response returns a value', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref({
                name: 'name',
              } as Playlist),
              error: ref(null),
            });

            result.getPlaylistById();
          });

          it('sets the playlist value', () => {
            expect(result.playlist.value).toEqual({
              name: 'name',
            });
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });
      });

      describe('when fetchData response is not successful', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: ref(null),
            error: ref(new Error('Error message.')),
          });

          result.getPlaylistById();
        });

        it('sets the playlist value', () => {
          expect(result.playlist.value).toEqual(null);
        });

        it('calls the addErrorSnack function', () => {
          expect(addErrorSnackMock).toHaveBeenCalledWith('Error message.');
        });
      });
    });

    describe('when id is set', () => {
      beforeEach(() => {
        result = withSetup(usePlaylist);
        result.getPlaylistById('playlistId');
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

      describe('when fetchData response is successful', () => {
        describe('when response returns null', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref(null),
              error: ref(null),
            });

            result.getPlaylistById('playlistId');
          });

          it('sets the playlist value', () => {
            expect(result.playlist.value).toEqual(null);
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });

        describe('when response returns a value', () => {
          beforeEach(() => {
            fetchDataMock.mockResolvedValue({
              data: ref({
                name: 'name',
              } as Playlist),
              error: ref(null),
            });

            result.getPlaylistById('playlistId');
          });

          it('sets the playlist value', () => {
            expect(result.playlist.value).toEqual({
              name: 'name',
            });
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });
      });

      describe('when fetchData response is not successful', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: ref(null),
            error: ref(new Error('Error message.')),
          });

          result.getPlaylistById('playlistId');
        });

        it('sets the playlist value', () => {
          expect(result.playlist.value).toEqual(null);
        });

        it('calls the addErrorSnack function', () => {
          expect(addErrorSnackMock).toHaveBeenCalledWith('Error message.');
        });
      });
    });
  });

  describe('when the createPlaylist function is called', () => {
    describe('when fetchData response is successful', () => {
      describe('when response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: ref(null),
            error: ref(null),
          });

          result = withSetup(usePlaylist);
          result.createPlaylist('name');
        });

        it('does not add to the playlists value', () => {
          expect(result.playlists.value).toEqual([]);
        });

        it('calls the addErrorSnack function', () => {
          expect(addErrorSnackMock).toHaveBeenCalled();
        });

        it('does not call the addSuccessSnackMock function', () => {
          expect(addSuccessSnackMock).not.toHaveBeenCalledWith();
        });
      });

      describe('when response returns a value', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: ref({
              name: 'name',
            } as Playlist),
            error: ref(null),
          });

          result.createPlaylist('name');
        });

        it('adds to the playlists value', () => {
          expect(result.playlists.value).toEqual([
            {
              name: 'name',
            },
          ]);
        });

        it('does not call the addErrorSnack function', () => {
          expect(addErrorSnackMock).not.toHaveBeenCalled();
        });

        it('calls the addSuccessSnackMock function', () => {
          expect(addSuccessSnackMock).toHaveBeenCalledWith(
            'Successfully added playlist name',
          );
        });
      });
    });

    describe('when fetchData response is not successful', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: ref(null),
          error: ref(new Error('Error message.')),
        });

        result.createPlaylist('name');
      });

      it('does not add to the playlists value', () => {
        expect(result.playlists.value).toEqual([]);
      });

      it('calls the addErrorSnack function', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith('Error message.');
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalledWith();
      });
    });
  });
});
