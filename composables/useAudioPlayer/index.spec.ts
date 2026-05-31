import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useQueueMock } from '@/test/useQueueMock';
import { withSetup } from '@/test/withSetup';

import { useAudioPlayer } from './index';

vi.useFakeTimers();

type CB = (...args: unknown[]) => void;

let onBufferedCb: CB;
let onCanPlayCb: CB;
let onEndedCb: CB;
let onPauseCb: CB;
let onPlayCb: CB;
let onTimeupdateCb: CB;
let onWaitingCb: CB;

const changePlaybackRateMock = vi.fn();
const loadFromElementMock = vi.fn();
const setVolumeMock = vi.fn();
const loadMock = vi.fn();
const onBufferedMock = vi.fn((cb) => (onBufferedCb = cb));
const onCanPlayMock = vi.fn((cb) => (onCanPlayCb = cb));
const onEndedMock = vi.fn((cb) => (onEndedCb = cb));
const onPauseMock = vi.fn((cb) => (onPauseCb = cb));
const onPlayMock = vi.fn((cb) => (onPlayCb = cb));
const onTimeupdateMock = vi.fn((cb) => (onTimeupdateCb = cb));
const onWaitingMock = vi.fn((cb) => (onWaitingCb = cb));
const pauseMock = vi.fn();
const playMock = vi.fn(() => Promise.resolve());
const setCurrentTimeMock = vi.fn();
const unloadMock = vi.fn();

mockNuxtImport('AudioPlayer', () =>
  vi.fn(function () {
    return {
      changePlaybackRate: changePlaybackRateMock,
      load: loadMock,
      loadFromElement: loadFromElementMock,
      onBuffered: onBufferedMock,
      onCanPlay: onCanPlayMock,
      onEnded: onEndedMock,
      onPause: onPauseMock,
      onPlay: onPlayMock,
      onTimeupdate: onTimeupdateMock,
      onWaiting: onWaitingMock,
      pause: pauseMock,
      play: playMock,
      setCurrentTime: setCurrentTimeMock,
      setVolume: setVolumeMock,
      unload: unloadMock,
    };
  }),
);

const preloadMock = vi.fn();
const consumeMock = vi.fn();
const pruneMock = vi.fn();
const clearPreloaderMock = vi.fn();

mockNuxtImport('AudioPreloader', () =>
  vi.fn(function () {
    return {
      clear: clearPreloaderMock,
      consume: consumeMock,
      has: vi.fn(() => false),
      preload: preloadMock,
      prune: pruneMock,
      size: 0,
    };
  }),
);

const scrobbleMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  scrobble: scrobbleMock,
}));

const setMediaSessionMetadataMock = vi.fn();
const setMediaSessionPlaybackStateMock = vi.fn();
const setMediaSessionPositionStateMock = vi.fn();
const setupMediaSessionHandlersMock = vi.fn();

mockNuxtImport('useMediaSession', () => () => ({
  setMediaSessionMetadata: setMediaSessionMetadataMock,
  setMediaSessionPlaybackState: setMediaSessionPlaybackStateMock,
  setMediaSessionPositionState: setMediaSessionPositionStateMock,
  setupMediaSessionHandlers: setupMediaSessionHandlersMock,
}));

const createBookmarkMock = vi.fn();
const deleteBookmarkMock = vi.fn();

mockNuxtImport('useBookmark', () => () => ({
  createBookmark: createBookmarkMock,
  deleteBookmark: deleteBookmarkMock,
}));

const loadDashboardAlbumsMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  loadDashboardAlbums: loadDashboardAlbumsMock,
}));

const addErrorSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addErrorSnack: addErrorSnackMock,
}));

const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const setLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const getLocalStorageMock = vi.hoisted(() =>
  vi.fn<() => null | typeof AUDIO_PLAYER_DEFAULT_STATES>(() => null),
);

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

const {
  addTracksMock,
  currentTrackMock,
  hasCurrentTrackMock,
  isLastTrackMock,
  isPodcastEpisodeMock,
  isTrackMock,
  navigateQueueMock,
  queueListMock,
  removeTrackMock,
  reorderQueueTracksMock,
  restoreQueueMock,
  shuffleQueueMock,
  updateCurrentTrackPositionMock,
} = useQueueMock();

const queueTracks = getFormattedQueueTracksMock(6);
const queueTrack = getFormattedQueueTracksMock()[0];

describe('useAudioPlayer', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>;

  beforeAll(() => {
    navigateQueueMock.mockReturnValue(queueTrack);
    result = withSetup(useAudioPlayer);
  });

  it('sets the default isBuffering value', () => {
    expect(result.composable.isBuffering.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
    );
  });

  it('sets the default currentTime value', () => {
    expect(result.composable.currentTime.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.currentTime,
    );
  });

  it('sets the default bufferedDuration value', () => {
    expect(result.composable.bufferedDuration.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
    );
  });

  it('sets the default isPlaying value', () => {
    expect(result.composable.isPlaying.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.isPlaying,
    );
  });

  it('sets the default playbackRate value', () => {
    expect(result.composable.playbackRate.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
    );
  });

  it('sets the default isMuted value', () => {
    expect(result.composable.isMuted.value).toBe(false);
  });

  it('sets the default volume value', () => {
    expect(result.composable.volume.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.volume,
    );
  });

  it('sets the default repeat value', () => {
    expect(result.composable.repeat.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.repeat,
    );
  });

  it('sets the default shuffle value', () => {
    expect(result.composable.shuffle.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.shuffle,
    );
  });

  it('sets the correct canPlayNext value', () => {
    expect(result.composable.canPlayNext.value).toBe(false);
  });

  it('sets the correct canPlayPrevious value', () => {
    expect(result.composable.canPlayPrevious.value).toBe(false);
  });

  describe('when the restoreAudioPlayerState function is called', () => {
    describe('when the playerStateRestored value is false', () => {
      beforeEach(() => {
        useState(STATE_KEYS.playerStateRestored).value = false;
      });

      beforeAll(async () => {
        getLocalStorageMock.mockReturnValue(null);

        result = withSetup(useAudioPlayer);
        await result.composable.restoreAudioPlayerState();
      });

      it('calls the onTimeupdate function', () => {
        expect(onTimeupdateMock).toHaveBeenCalled();
      });

      it('calls the onCanPlay function', () => {
        expect(onCanPlayMock).toHaveBeenCalled();
      });

      it('calls the onBuffered function', () => {
        expect(onBufferedMock).toHaveBeenCalled();
      });

      it('calls the onWaiting function', () => {
        expect(onWaitingMock).toHaveBeenCalled();
      });

      it('calls the onEnded function', () => {
        expect(onEndedMock).toHaveBeenCalled();
      });

      it('calls the onPause function', () => {
        expect(onPauseMock).toHaveBeenCalled();
      });

      it('calls the onPlay function', () => {
        expect(onPlayMock).toHaveBeenCalled();
      });

      describe('when the getLocalStorage function returns null', () => {
        it('resets the correct bufferedDuration value', () => {
          expect(result.composable.bufferedDuration.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
          );
        });

        it('resets the correct currentTime value', () => {
          expect(result.composable.currentTime.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.currentTime,
          );
        });

        it('resets the correct isBuffering value', () => {
          expect(result.composable.isBuffering.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
          );
        });

        it('resets the correct isPlaying value', () => {
          expect(result.composable.isPlaying.value).toBe(false);
        });

        it('resets the correct playbackRate value', () => {
          expect(result.composable.playbackRate.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
          );
        });

        it('resets the correct repeat value', () => {
          expect(result.composable.repeat.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.repeat,
          );
        });

        it('resets the correct shuffle value', () => {
          expect(result.composable.shuffle.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.shuffle,
          );
        });

        it('resets the correct volume value', () => {
          expect(result.composable.volume.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.volume,
          );
        });
      });

      describe('when the getLocalStorage function returns data', () => {
        beforeAll(async () => {
          getLocalStorageMock.mockReturnValue({
            ...AUDIO_PLAYER_DEFAULT_STATES,
            currentTime: 55,
            playbackRate: 0,
            repeat: -1,
            shuffle: false,
            volume: 0.5,
          });

          result = withSetup(useAudioPlayer);
          await result.composable.restoreAudioPlayerState();
        });

        it('sets the correct repeat value', () => {
          expect(result.composable.repeat.value).toBe(-1);
        });

        it('sets the correct shuffle value', () => {
          expect(result.composable.shuffle.value).toBe(false);
        });

        it('sets the correct volume value', () => {
          expect(result.composable.volume.value).toBe(0.5);
        });

        it('calls the audio setVolume function with the correct parameters', () => {
          expect(setVolumeMock).toHaveBeenCalledWith(0.5);
        });

        it('calls the audio changePlaybackRate function with the correct parameters', () => {
          expect(changePlaybackRateMock).toHaveBeenCalledWith(0.5);
        });

        describe('when the hasCurrentTrack value is false', () => {
          it('does not call the audio load function', () => {
            expect(loadMock).not.toHaveBeenCalled();
          });
        });

        describe('when the hasCurrentTrack value is true', () => {
          beforeAll(async () => {
            hasCurrentTrackMock.value = true;

            result = withSetup(useAudioPlayer);
            await result.composable.restoreAudioPlayerState();
          });

          it('calls the audio load function with the correct parameters', () => {
            expect(loadMock).toHaveBeenCalledWith(
              currentTrackMock.value.streamUrlId,
            );
          });

          it('calls the setMediaSessionMetadata function', () => {
            expect(setMediaSessionMetadataMock).toHaveBeenCalled();
          });

          it('calls the setupMediaSessionHandlers function', () => {
            expect(setupMediaSessionHandlersMock).toHaveBeenCalled();
          });

          describe('when saved state has no currentTime', () => {
            beforeAll(async () => {
              getLocalStorageMock.mockReturnValue({
                ...AUDIO_PLAYER_DEFAULT_STATES,
                playbackRate: 0,
                repeat: -1,
                shuffle: false,
                volume: 0.5,
              });
              currentTrackMock.value.position = 7;

              result = withSetup(useAudioPlayer);
              await result.composable.restoreAudioPlayerState();
            });

            it('calls the setCurrentTime function with the correct parameters', () => {
              expect(setCurrentTimeMock).toHaveBeenCalledWith(7);
            });

            describe('when the currentTrack value has a position', () => {
              beforeAll(async () => {
                currentTrackMock.value.position = 7;
                result = withSetup(useAudioPlayer);
                await result.composable.restoreAudioPlayerState();
              });

              it('calls the setCurrentTime function with the correct parameters', () => {
                expect(setCurrentTimeMock).toHaveBeenCalledWith(7);
              });
            });

            describe('when the currentTrack value does not have a position', () => {
              beforeAll(async () => {
                currentTrackMock.value.position = undefined;
                result = withSetup(useAudioPlayer);
                await result.composable.restoreAudioPlayerState();
              });

              it('calls the setCurrentTime function with the correct parameters', () => {
                expect(setCurrentTimeMock).toHaveBeenCalledWith(0);
              });
            });
          });

          describe('when the queueList value is not an empty array', () => {
            it('calls the audio preloader preload function with the correct parameters', () => {
              expect(preloadMock).toHaveBeenCalledWith(
                queueListMock.value[1].streamUrlId,
              );
              expect(preloadMock).toHaveBeenCalledWith(
                queueListMock.value[2].streamUrlId,
              );
              expect(preloadMock).toHaveBeenCalledWith(
                queueListMock.value[3].streamUrlId,
              );
            });

            it('calls the audio preloader prune function with correct parameters', () => {
              expect(pruneMock).toHaveBeenCalledWith(
                new Set([
                  queueListMock.value[1].streamUrlId,
                  queueListMock.value[2].streamUrlId,
                  queueListMock.value[3].streamUrlId,
                ]),
              );
            });
          });

          describe('when the queueList value is an empty array', () => {
            beforeAll(async () => {
              vi.clearAllMocks();
              queueListMock.value = [];
              result = withSetup(useAudioPlayer);
              await result.composable.restoreAudioPlayerState();
            });

            it('does not call the audio preloader preload function', () => {
              expect(preloadMock).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('when the playerStateRestored value is true', () => {
      beforeAll(async () => {
        vi.clearAllMocks();
        useState(STATE_KEYS.playerStateRestored).value = true;
        await result.composable.restoreAudioPlayerState();
      });

      it('does not call the onTimeupdate function', () => {
        expect(onTimeupdateMock).not.toHaveBeenCalled();
      });
    });

    describe('when onBuffered event is called', () => {
      beforeAll(() => {
        onBufferedCb(23);
      });

      it('sets the correct bufferedDuration value', () => {
        expect(result.composable.bufferedDuration.value).toBe(23);
      });
    });

    describe('when onWaiting event is called', () => {
      beforeAll(() => {
        onWaitingCb();
      });

      it('sets the correct isBuffering value', () => {
        expect(result.composable.isBuffering.value).toBe(true);
      });
    });

    describe('when onCanPlay event is called', () => {
      beforeAll(() => {
        onCanPlayCb();
      });

      it('sets the correct isBuffering value', () => {
        expect(result.composable.isBuffering.value).toBe(false);
      });
    });

    describe('when onTimeupdate event is called', () => {
      beforeAll(() => {
        onTimeupdateCb(20);
      });

      it('sets the correct currentTime value', () => {
        expect(result.composable.currentTime.value).toBe(20);
      });

      it('calls the setMediaSessionPositionState function', () => {
        expect(setMediaSessionPositionStateMock).toHaveBeenCalled();
      });
    });

    describe('when the audio element is externally paused', () => {
      describe('when the isPlaying value is true', () => {
        beforeAll(async () => {
          result.composable.isPlaying.value = true;
          onPauseCb();
        });

        it('sets the correct isPlaying value', () => {
          expect(result.composable.isPlaying.value).toBe(false);
        });

        it('calls the setMediaSessionPlaybackState function with the correct parameters', () => {
          expect(setMediaSessionPlaybackStateMock).toHaveBeenCalledWith(
            'paused',
          );
        });

        describe('when the onPlay event is called', () => {
          beforeAll(() => {
            onPlayCb();
          });

          it('calls the pause function', () => {
            expect(pauseMock).toHaveBeenCalled();
          });

          it('calls the play function', () => {
            expect(playMock).toHaveBeenCalled();
          });

          it('sets the correct isPlaying value', () => {
            expect(result.composable.isPlaying.value).toBe(true);
          });

          it('calls the setMediaSessionPlaybackState function with the correct parameters', () => {
            expect(setMediaSessionPlaybackStateMock).toHaveBeenCalledWith(
              'playing',
            );
          });
        });
      });
    });

    describe('when the onPlay event is called', () => {
      describe('when the pausedExternally value is false', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          onPlayCb();
        });

        it('does not call the pause function', () => {
          expect(pauseMock).not.toHaveBeenCalled();
        });

        it('does not call the play function', () => {
          expect(playMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when onEnded event is called', () => {
      beforeAll(() => {
        onEndedCb();
      });

      it('calls the loadDashboardAlbums function', () => {
        expect(loadDashboardAlbumsMock).toHaveBeenCalled();
      });

      describe(`when track type is not ${MEDIA_TYPE.podcastEpisode}`, () => {
        it('does not call the deleteBookmark function', () => {
          expect(deleteBookmarkMock).not.toHaveBeenCalled();
        });
      });

      describe(`when track type is ${MEDIA_TYPE.podcastEpisode}`, () => {
        beforeAll(() => {
          isPodcastEpisodeMock.value = true;
          onEndedCb();
        });

        it('calls the deleteBookmark function', () => {
          expect(deleteBookmarkMock).toHaveBeenCalled();
        });
      });

      describe('when repeat value is 1', () => {
        beforeAll(() => {
          result.composable.repeat.value = 1;
          onEndedCb();
        });

        it('calls the audio load function', () => {
          expect(loadMock).toHaveBeenCalled();
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });
      });

      describe('when repeat value is -1', () => {
        beforeAll(() => {
          result.composable.repeat.value = -1;
          onEndedCb();
        });

        it('calls the audio load function', () => {
          expect(loadMock).toHaveBeenCalled();
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        describe('when track is the last track in queueList value', () => {
          beforeAll(() => {
            isLastTrackMock.value = true;
            vi.clearAllMocks();
            onEndedCb();
          });

          it('calls the audio load function', () => {
            expect(loadMock).toHaveBeenCalled();
          });

          it('calls the audio play function', () => {
            expect(playMock).toHaveBeenCalled();
          });

          it('calls the audio pause function', () => {
            expect(pauseMock).toHaveBeenCalled();
          });
        });
      });

      describe('when repeat value is infinity', () => {
        beforeAll(() => {
          result.composable.repeat.value = REPEAT_MODE.all;
          onEndedCb();
        });

        afterAll(() => {
          result.composable.repeat.value = AUDIO_PLAYER_DEFAULT_STATES.repeat;
        });

        it('calls the audio load function', () => {
          expect(loadMock).toHaveBeenCalled();
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the addTracksToQueue function is called', () => {
    beforeAll(() => {
      result.composable.addTracksToQueue(queueTracks);
    });

    it('calls the addTracks function with the correct parameters', () => {
      expect(addTracksMock).toHaveBeenCalledWith(queueTracks);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalled();
    });

    describe('when the queueList value length is 0', () => {
      beforeAll(() => {
        addTracksMock.mockImplementationOnce((tracks) => {
          queueListMock.value = [];
          queueListMock.value.push(...tracks);

          return false;
        });

        result.composable.addTracksToQueue(queueTracks);
      });

      it('calls the audio load function', () => {
        expect(loadMock).toHaveBeenCalled();
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });

    describe('when the queueList value length is greater than 0', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.addTracksToQueue(queueTracks);
      });

      it('does not call the audio load function', () => {
        expect(loadMock).not.toHaveBeenCalled();
      });

      it('does not call the audio play function', () => {
        expect(playMock).not.toHaveBeenCalled();
      });

      it('calls the audio preloader preload function', () => {
        expect(preloadMock).toHaveBeenCalled();
      });

      it('calls the audio preloader prune function', () => {
        expect(pruneMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the addTrackToQueue function is called', () => {
    beforeAll(() => {
      queueListMock.value = [];
      result.composable.addTrackToQueue(queueTrack);
    });

    it('calls the addTracks function with the correct parameters', () => {
      expect(addTracksMock).toHaveBeenCalledWith([queueTrack]);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalled();
    });
  });

  describe('when the playTracks function is called', () => {
    beforeAll(() => {
      result.composable.playTracks(queueTracks);
    });

    it('resets the shuffle value', () => {
      expect(result.composable.shuffle.value).toEqual(
        AUDIO_PLAYER_DEFAULT_STATES.shuffle,
      );
    });

    it('resets the repeat value', () => {
      expect(result.composable.repeat.value).toEqual(
        AUDIO_PLAYER_DEFAULT_STATES.repeat,
      );
    });

    it('sets the correct bufferedDuration value', () => {
      expect(result.composable.bufferedDuration.value).toBe(0);
    });

    it('calls the audio unload function', () => {
      expect(unloadMock).toHaveBeenCalled();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalled();
    });

    it('calls the addTracks function with the correct parameters', () => {
      expect(addTracksMock).toHaveBeenCalledWith(queueTracks, true);
    });

    it('calls the setMediaSessionMetadata function', () => {
      expect(setMediaSessionMetadataMock).toHaveBeenCalled();
    });

    it('calls the setupMediaSessionHandlers function', () => {
      expect(setupMediaSessionHandlersMock).toHaveBeenCalled();
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });

    it('sets the correct isPlaying value', () => {
      expect(result.composable.isPlaying.value).toBe(true);
    });

    it('calls the setMediaSessionPlaybackState function with the correct parameters', () => {
      expect(setMediaSessionPlaybackStateMock).toHaveBeenCalledWith('playing');
    });

    it('calls the audio preloader preload function with the correct parameters', () => {
      expect(preloadMock).toHaveBeenCalledWith(queueTracks[1].streamUrlId);
      expect(preloadMock).toHaveBeenCalledWith(queueTracks[2].streamUrlId);
      expect(preloadMock).toHaveBeenCalledWith(queueTracks[3].streamUrlId);
    });

    it('calls the audio preloader prune function', () => {
      expect(pruneMock).toHaveBeenCalled();
    });

    it('calls the setMediaSessionPositionState function', () => {
      expect(setMediaSessionPositionStateMock).toHaveBeenCalled();
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalled();
    });

    describe('when the track value does not have a position', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.playTracks(queueTracks);
      });

      it('does not call the setCurrentTime function', () => {
        expect(setCurrentTimeMock).not.toHaveBeenCalled();
      });
    });

    describe('when the track value has a position', () => {
      beforeAll(() => {
        navigateQueueMock.mockReturnValueOnce(
          getFormattedQueueTracksMock(1, {
            position: 4,
          })[0],
        );

        result.composable.playTracks(queueTracks);
      });

      it('calls the setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(4);
      });
    });

    describe('when a pre-loaded element exists for the current track', () => {
      beforeAll(async () => {
        vi.clearAllMocks();
        consumeMock.mockReturnValueOnce(queueTrack.streamUrlId);
        await result.composable.playTracks([...queueTracks]);
      });

      it('calls the audio loadFromElement function', () => {
        expect(loadFromElementMock).toHaveBeenCalled();
      });

      it('sets the correct isBuffering value', () => {
        expect(result.composable.isBuffering.value).toBe(false);
      });
    });

    describe('when the audio play throws an error', () => {
      describe('when the navigator.onLine is false', () => {
        beforeAll(() => {
          playMock.mockImplementationOnce(() => {
            throw new Error('new Error message.');
          });

          result.composable.playTracks(queueTracks);
        });

        it('does not call the addErrorSnack function', () => {
          expect(addErrorSnackMock).not.toHaveBeenCalled();
        });
      });

      describe('when the navigator.onLine is true', () => {
        beforeAll(() => {
          Object.defineProperty(globalThis.navigator, 'onLine', {
            configurable: true,
            value: true,
            writable: true,
          });
        });

        describe('when the error does not contain no supported source', () => {
          beforeAll(() => {
            playMock.mockImplementationOnce(() => {
              throw new Error('new Error message.');
            });

            result.composable.playTracks(queueTracks);
          });

          it('does not call the addErrorSnack function', () => {
            expect(addErrorSnackMock).not.toHaveBeenCalled();
          });
        });

        describe('when the error contains no supported source', () => {
          beforeAll(() => {
            playMock.mockImplementationOnce(() => {
              throw new Error('no supported source.');
            });

            result.composable.playTracks(queueTracks);
          });

          it('calls the addErrorSnack function with the correct parameters', () => {
            expect(addErrorSnackMock).toHaveBeenCalledWith(
              `The track ${queueTrack.id} was not found on the server and removed from queue.`,
            );
          });
        });
      });
    });

    describe.each([
      [MEDIA_TYPE.track, 0],
      [MEDIA_TYPE.radioStation, 0],
      [MEDIA_TYPE.podcastEpisode, 4], // Includes calls from the changeTrack and syncPlaybackPosition functions.
    ])('when the track type is %s', (type, createBookmarkCalledLength) => {
      beforeAll(async () => {
        const tracksWithType = getFormattedQueueTracksMock(1, {
          type,
        });

        isPodcastEpisodeMock.value = type === MEDIA_TYPE.podcastEpisode;

        vi.clearAllMocks();

        await result.composable.playTracks(tracksWithType);

        vi.advanceTimersByTime(SAVE_INTERVAL * 2);
      });

      it(`${createBookmarkCalledLength ? 'calls' : 'does not call'} the createBookmark function`, () => {
        expect(createBookmarkMock).toHaveBeenCalledTimes(
          createBookmarkCalledLength,
        );
      });

      it('calls the updateCurrentTrackPosition function', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(0);
      });

      it(`${createBookmarkCalledLength ? 'calls' : 'does not call'} the changePlaybackRate function`, () => {
        if (createBookmarkCalledLength) {
          expect(changePlaybackRateMock).toHaveBeenCalledWith(0.5);
        } else {
          expect(changePlaybackRateMock).not.toHaveBeenCalled();
        }
      });
    });

    describe('when the isTrack value is false', () => {
      beforeAll(async () => {
        vi.advanceTimersByTime(SAVE_INTERVAL * 2);
      });

      it('does not call the scrobble function', () => {
        expect(scrobbleMock).not.toHaveBeenCalled();
      });
    });

    describe('when the isTrack value is true', () => {
      describe('when currentTime is less than or equal to 80% of track duration', () => {
        beforeAll(async () => {
          isTrackMock.value = true;
          result.composable.currentTime.value = 80;

          vi.advanceTimersByTime(SAVE_INTERVAL);
        });

        it('does not call the scrobble function', () => {
          expect(scrobbleMock).not.toHaveBeenCalled();
        });
      });

      describe('when currentTime is greater than 80% of track duration', () => {
        beforeAll(async () => {
          result.composable.currentTime.value = 100;
          vi.advanceTimersByTime(SAVE_INTERVAL);
        });

        it('calls the scrobble function with the correct parameters', () => {
          expect(scrobbleMock).toHaveBeenCalledWith(queueTrack.id);
        });
      });
    });
  });

  describe('when the togglePlay function is called', () => {
    beforeAll(async () => {
      result = withSetup(useAudioPlayer);
      vi.clearAllMocks();
      await result.composable.togglePlay();
    });

    it('sets the correct isPlaying value', () => {
      expect(result.composable.isPlaying.value).toBe(false);
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('calls the setMediaSessionPlaybackState function with the correct parameters', () => {
      expect(setMediaSessionPlaybackStateMock).toHaveBeenCalledWith('paused');
    });

    describe('when togglePlay function is called again', () => {
      beforeAll(async () => {
        await result.composable.togglePlay();
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      it('sets the correct isPlaying value', () => {
        expect(result.composable.isPlaying.value).toBe(true);
      });

      it('calls the setMediaSessionPlaybackState function with the correct parameters', () => {
        expect(setMediaSessionPlaybackStateMock).toHaveBeenCalledWith(
          'playing',
        );
      });
    });
  });

  describe('when playFromQueue function is called', () => {
    beforeAll(() => {
      result.composable.playFromQueue(4);
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalled();
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.currentTime.value = 120;
        result.composable.playFromQueue(4);
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          120,
        );
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.currentTime.value = 130;
        result.composable.playFromQueue(4);
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when removeFromQueue function is called', () => {
    describe('when the removed track is the only track in the queue', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        removeTrackMock.mockReturnValueOnce(1);
        result.composable.removeFromQueue(queueTrack.id);
      });

      it('calls the audio unload function', () => {
        expect(unloadMock).toHaveBeenCalled();
      });

      it('calls the audio preloader clear function', () => {
        expect(clearPreloaderMock).toHaveBeenCalled();
      });

      it('does not call the setMediaSessionMetadata function', () => {
        expect(setMediaSessionMetadataMock).not.toHaveBeenCalled();
      });
    });

    describe('when the removed track is not the only track in the queue', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        removeTrackMock.mockReturnValueOnce(true);
        result.composable.removeFromQueue(queueTrack.id);
      });

      it('calls the audio unload function', () => {
        expect(unloadMock).toHaveBeenCalled();
      });

      it('calls the setMediaSessionMetadata function', () => {
        expect(setMediaSessionMetadataMock).toHaveBeenCalled();
      });

      describe('when the removed track was playing', () => {
        it('does not update the isPlaying value', () => {
          expect(result.composable.isPlaying.value).toBe(true);
        });

        it('does not call the audio pause function', () => {
          expect(pauseMock).not.toHaveBeenCalled();
        });
      });

      describe('when the removed track was not playing', () => {
        beforeAll(async () => {
          vi.clearAllMocks();
          removeTrackMock.mockReturnValueOnce(true);
          await result.composable.togglePlay();
          result.composable.removeFromQueue(queueTrack.id);
        });

        it('sets the correct isPlaying value', () => {
          expect(result.composable.isPlaying.value).toBe(false);
        });

        it('calls the audio pause function', () => {
          expect(pauseMock).toHaveBeenCalled();
        });

        it('calls the setMediaSessionPlaybackState function with the correct parameters', () => {
          expect(setMediaSessionPlaybackStateMock).toHaveBeenCalledWith(
            'paused',
          );
        });
      });
    });
  });

  describe('when setVolume function is called', () => {
    beforeAll(() => {
      result.composable.setVolume(0.23);
    });

    it('calls the audio setVolume function with the correct parameters', () => {
      expect(setVolumeMock).toHaveBeenCalledWith(0.23);
    });

    it('sets the correct playbackRate value', () => {
      expect(result.composable.volume.value).toBe(0.23);
    });
  });

  describe('when seekTo function is called', () => {
    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.seekTo(42);
      });

      it('calls the audio setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(42);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          42,
        );
      });

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(42);
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.seekTo(50);
      });

      it('calls the audio setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(50);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(50);
      });
    });
  });

  describe('when setPlaybackRate function is called', () => {
    beforeAll(() => {
      result.composable.setPlaybackRate(0);
    });

    it('calls the audio changePlaybackRate function with the correct parameters', () => {
      expect(changePlaybackRateMock).toHaveBeenCalledWith(
        PLAYBACK_RATES[0].speed,
      );
    });

    it('sets the correct playbackRate value', () => {
      expect(result.composable.playbackRate.value).toBe(0);
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.objectContaining({
          playbackRate: 0,
        }),
      );
    });
  });

  describe('when setPlaybackRateWithIncrement function is called', () => {
    describe(`when value is greater than ${PLAYBACK_RATES.length}`, () => {
      const expectedPlaybackRate = PLAYBACK_RATES.length - 1;

      beforeAll(() => {
        result.composable.setPlaybackRateWithIncrement(
          +(PLAYBACK_RATES.length + 1),
        );
      });

      it('calls the audio changePlaybackRate function with the correct parameters', () => {
        expect(changePlaybackRateMock).toHaveBeenCalledWith(
          PLAYBACK_RATES[expectedPlaybackRate].speed,
        );
      });

      it('sets the correct playbackRate value', () => {
        expect(result.composable.playbackRate.value).toBe(expectedPlaybackRate);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            playbackRate: expectedPlaybackRate,
          }),
        );
      });
    });

    describe('when value is less than 0', () => {
      beforeAll(() => {
        result.composable.setPlaybackRateWithIncrement(-PLAYBACK_RATES.length);
      });

      it('calls the audio changePlaybackRate function with the correct parameters', () => {
        expect(changePlaybackRateMock).toHaveBeenCalledWith(
          PLAYBACK_RATES[0].speed,
        );
      });

      it('sets the correct playbackRate value', () => {
        expect(result.composable.playbackRate.value).toBe(0);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            playbackRate: 0,
          }),
        );
      });
    });

    describe(`when value is in between 0 and ${PLAYBACK_RATES.length}`, () => {
      beforeAll(() => {
        result.composable.setPlaybackRateWithIncrement(+1);
      });

      it('calls the audio changePlaybackRate function with the correct parameters', () => {
        expect(changePlaybackRateMock).toHaveBeenCalledWith(
          PLAYBACK_RATES[1].speed,
        );
      });

      it('sets the correct playbackRate value', () => {
        expect(result.composable.playbackRate.value).toBe(1);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            playbackRate: 1,
          }),
        );
      });
    });
  });

  describe.each([
    [REPEAT_MODE.all, true],
    [REPEAT_MODE.one, false],
    [REPEAT_MODE.off, false],
  ])('when cycleRepeat function is called', (outcome, hasNextPreviousTrack) => {
    beforeAll(() => {
      // Set queueList value to empty array to ensure that the canPlayNext and
      // canPlayPrevious values are determined solely by the repeat value.
      queueListMock.value = [];
      result.composable.cycleRepeat();
    });

    it('sets the correct repeat value', () => {
      expect(result.composable.repeat.value).toBe(outcome);
    });

    it('sets the correct canPlayNext value', () => {
      expect(result.composable.canPlayNext.value).toBe(hasNextPreviousTrack);
    });

    it('sets the correct canPlayPrevious value', () => {
      expect(result.composable.canPlayPrevious.value).toBe(
        hasNextPreviousTrack,
      );
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.objectContaining({
          repeat: outcome,
        }),
      );
    });
  });

  describe('when playTracksShuffled function is called', () => {
    beforeAll(() => {
      result.composable.playTracksShuffled(queueTracks);
    });

    it('calls the shuffleQueue function', () => {
      expect(shuffleQueueMock).toHaveBeenCalled();
    });

    it('sets the correct shuffle value', () => {
      expect(result.composable.shuffle.value).toBe(true);
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.objectContaining({
          shuffle: true,
        }),
      );
    });
  });

  describe('when toggleShuffle function is called', () => {
    beforeAll(() => {
      result.composable.toggleShuffle();
    });

    it('calls the restoreQueue function', () => {
      expect(restoreQueueMock).toHaveBeenCalled();
    });

    it('sets the correct shuffle value', () => {
      expect(result.composable.shuffle.value).toBe(false);
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.objectContaining({
          shuffle: false,
        }),
      );
    });

    describe('when toggleShuffle function is called again', () => {
      beforeAll(() => {
        result.composable.toggleShuffle();
      });

      it('calls the shuffleQueue function', () => {
        expect(shuffleQueueMock).toHaveBeenCalled();
      });

      it('sets the correct shuffle value', () => {
        expect(result.composable.shuffle.value).toBe(true);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            shuffle: true,
          }),
        );
      });
    });
  });

  describe('when toggleMute function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.toggleMute();
    });

    it('calls the audio setVolume function with the correct parameters', () => {
      expect(setVolumeMock).toHaveBeenCalledWith(0);
    });

    it('sets the correct volume value', () => {
      expect(result.composable.volume.value).toBe(0);
    });

    it('sets the correct isMuted value', () => {
      expect(result.composable.isMuted.value).toBe(true);
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.objectContaining({
          volume: 0,
        }),
      );
    });

    describe('when toggleMute function is called again', () => {
      describe('when volume is greater than 0', () => {
        beforeAll(() => {
          result.composable.toggleMute();
        });

        it('calls the audio setVolume function with the correct parameters', () => {
          expect(setVolumeMock).toHaveBeenCalledWith(0.23);
        });

        it('sets the correct volume value', () => {
          expect(result.composable.volume.value).toBe(0.23);
        });

        it('sets the correct isMuted value', () => {
          expect(result.composable.isMuted.value).toBe(false);
        });

        it('calls the setLocalStorage function with the correct parameters', () => {
          expect(setLocalStorageMock).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.player,
            expect.objectContaining({
              volume: 0.23,
            }),
          );
        });
      });

      describe('when volume is 0', () => {
        beforeAll(() => {
          result.composable.volume.value = 0;
          result.composable.toggleMute();
        });

        it('calls the audio setVolume function with the correct parameters', () => {
          expect(setVolumeMock).toHaveBeenCalledWith(0.1);
        });

        it('sets the correct volume value', () => {
          expect(result.composable.volume.value).toBe(0.1);
        });

        it('sets the correct isMuted value', () => {
          expect(result.composable.isMuted.value).toBe(false);
        });

        it('calls the setLocalStorage function with the correct parameters', () => {
          expect(setLocalStorageMock).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.player,
            expect.objectContaining({
              volume: 0.1,
            }),
          );
        });
      });
    });
  });

  describe('when setVolumeWithIncrement function is called', () => {
    describe('when value is greater than 1', () => {
      beforeAll(() => {
        result.composable.setVolumeWithIncrement(2);
      });

      it('calls the audio setVolume function with the correct parameters', () => {
        expect(setVolumeMock).toHaveBeenCalledWith(1);
      });

      it('sets the correct volume value', () => {
        expect(result.composable.volume.value).toBe(1);
      });

      it('sets the correct isMuted value', () => {
        expect(result.composable.isMuted.value).toBe(false);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            volume: 1,
          }),
        );
      });
    });

    describe('when value is less than 0', () => {
      beforeAll(() => {
        result.composable.setVolumeWithIncrement(-2);
      });

      it('calls the audio setVolume function with the correct parameters', () => {
        expect(setVolumeMock).toHaveBeenCalledWith(0);
      });

      it('sets the correct volume value', () => {
        expect(result.composable.volume.value).toBe(0);
      });

      it('sets the correct isMuted value', () => {
        expect(result.composable.isMuted.value).toBe(true);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            volume: 0,
          }),
        );
      });
    });

    describe('when value is in between 0 and 1', () => {
      beforeAll(() => {
        result.composable.setVolumeWithIncrement(+0.5);
      });

      it('calls the audio setVolume function with the correct parameters', () => {
        expect(setVolumeMock).toHaveBeenCalledWith(0.5);
      });

      it('sets the correct volume value', () => {
        expect(result.composable.volume.value).toBe(0.5);
      });

      it('sets the correct isMuted value', () => {
        expect(result.composable.isMuted.value).toBe(false);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.objectContaining({
            volume: 0.5,
          }),
        );
      });
    });
  });

  describe('when playNextTrack function is called', () => {
    beforeAll(() => {
      navigateQueueMock.mockReturnValueOnce(queueTrack);
      result.composable.playNextTrack();
    });

    it('resets the currentTime value', () => {
      expect(result.composable.currentTime.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.currentTime,
      );
    });

    it('resets the bufferedDuration value', () => {
      expect(result.composable.bufferedDuration.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
      );
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalled();
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.currentTime.value = 75;
        navigateQueueMock.mockReturnValueOnce(queueTrack);
        result.composable.playNextTrack();
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          75,
        );
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.currentTime.value = 85;
        navigateQueueMock.mockReturnValueOnce(queueTrack);
        result.composable.playNextTrack();
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when playPreviousTrack function is called', () => {
    beforeAll(() => {
      result.composable.playPreviousTrack();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalled();
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.currentTime.value = 90;
        result.composable.playPreviousTrack();
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          90,
        );
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.currentTime.value = 95;
        result.composable.playPreviousTrack();
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when rewindTrack function is called', () => {
    describe(`when currentTime is greater than ${REWIND_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.currentTime.value = REWIND_TRACK_TIME + 1;
        result.composable.rewindTrack();
      });

      it('calls the audio setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(1);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe(`when currentTime is less than ${REWIND_TRACK_TIME}`, () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.currentTime.value = REWIND_TRACK_TIME - 1;
        result.composable.rewindTrack();
      });

      it('calls the audio setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(0);
      });
    });

    describe(`when currentTime is equal to ${REWIND_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.currentTime.value = REWIND_TRACK_TIME;
        result.composable.rewindTrack();
      });

      it('calls the audio setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(0);
      });
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.currentTime.value = REWIND_TRACK_TIME + 1;
        result.composable.rewindTrack();
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          1,
        );
      });

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(1);
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.currentTime.value = REWIND_TRACK_TIME + 1;
        result.composable.rewindTrack();
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('when fastForwardTrack function is called', () => {
    const duration = queueTrack.duration;

    describe(`when currentTime is less than the duration - ${FAST_FORWARD_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.currentTime.value =
          duration - FAST_FORWARD_TRACK_TIME - 1;
        result.composable.fastForwardTrack();
      });

      it('calls the audio setCurrentTime function with the correct parameters', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(119);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe(`when currentTime is greater than the duration - ${FAST_FORWARD_TRACK_TIME}`, () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.currentTime.value =
          duration - FAST_FORWARD_TRACK_TIME + 1;
        result.composable.fastForwardTrack();
      });

      it('does not call the audio setCurrentTime function', () => {
        expect(setCurrentTimeMock).not.toHaveBeenCalled();
      });
    });

    describe(`when currentTime is equal to the duration - ${FAST_FORWARD_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.currentTime.value =
          duration - FAST_FORWARD_TRACK_TIME;
        result.composable.fastForwardTrack();
      });

      it('does not call the audio setCurrentTime function', () => {
        expect(setCurrentTimeMock).not.toHaveBeenCalled();
      });
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.currentTime.value = 0;
        result.composable.fastForwardTrack();
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          30,
        );
      });

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(30);
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.currentTime.value = 0;
        result.composable.fastForwardTrack();
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(30);
      });
    });
  });

  describe('when reorderQueueTrack function is called', () => {
    beforeAll(() => {
      result.composable.reorderQueueTrack(2, 3);
    });

    it('calls the reorderQueueTracks function with the correct parameters', () => {
      expect(reorderQueueTracksMock).toHaveBeenCalledWith(2, 3);
    });

    it('calls the audio preloader prune function', () => {
      expect(pruneMock).toHaveBeenCalled();
    });
  });

  describe('when resetAudioPlayer function is called', () => {
    beforeAll(() => {
      queueListMock.value = [];
      result.composable.resetAudioPlayer();
    });

    it('calls the audio unload function', () => {
      expect(unloadMock).toHaveBeenCalled();
    });

    it('calls the audio preloader clear function', () => {
      expect(clearPreloaderMock).toHaveBeenCalled();
    });

    it('calls the deleteLocalStorage function', () => {
      expect(deleteLocalStorageMock).toHaveBeenCalled();
    });

    it('resets the isBuffering value to the default value', () => {
      expect(result.composable.isBuffering.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
      );
    });

    it('resets the currentTime value to the default value', () => {
      expect(result.composable.currentTime.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.currentTime,
      );
    });

    it('resets the bufferedDuration value to the default value', () => {
      expect(result.composable.bufferedDuration.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
      );
    });

    it('resets the isPlaying value to the default value', () => {
      expect(result.composable.isPlaying.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.isPlaying,
      );
    });

    it('resets the playbackRate value to the default value', () => {
      expect(result.composable.playbackRate.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
      );
    });

    it('resets the isMuted value to the default value', () => {
      expect(result.composable.isMuted.value).toBe(false);
    });

    it('resets the volume value to the default value', () => {
      expect(result.composable.volume.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.volume,
      );
    });

    it('resets the repeat value to the default value', () => {
      expect(result.composable.repeat.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.repeat,
      );
    });

    it('resets the shuffle value to the default value', () => {
      expect(result.composable.shuffle.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.shuffle,
      );
    });

    it('sets the correct canPlayNext value', () => {
      expect(result.composable.canPlayNext.value).toBe(false);
    });

    it('sets the correct canPlayPrevious value', () => {
      expect(result.composable.canPlayPrevious.value).toBe(false);
    });
  });

  describe('when resetPlayerSession function is called', () => {
    beforeAll(() => {
      result.composable.resetPlayerSession();
    });

    it('resets the repeat value to the default value', () => {
      expect(result.composable.repeat.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.repeat,
      );
    });

    it('resets the shuffle value to the default value', () => {
      expect(result.composable.shuffle.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.shuffle,
      );
    });

    it('resets the currentTime value to the default value', () => {
      expect(result.composable.currentTime.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.currentTime,
      );
    });

    it('resets the bufferedDuration value to the default value', () => {
      expect(result.composable.bufferedDuration.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
      );
    });

    it('calls the audio preloader clear function', () => {
      expect(clearPreloaderMock).toHaveBeenCalled();
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        result.composable.currentTime.value = 150;
        result.composable.resetPlayerSession();
      });

      it('calls the createBookmark function with the correct parameters', () => {
        expect(createBookmarkMock).toHaveBeenCalledWith(
          currentTrackMock.value.id,
          150,
        );
      });
    });

    describe('when the current track is not a podcast episode', () => {
      beforeAll(() => {
        isPodcastEpisodeMock.value = false;
        vi.clearAllMocks();
        result.composable.currentTime.value = 160;
        result.composable.resetPlayerSession();
      });

      it('does not call the createBookmark function', () => {
        expect(createBookmarkMock).not.toHaveBeenCalled();
      });
    });
  });
});
