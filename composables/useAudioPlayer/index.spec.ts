import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useQueueMock } from '@/test/useQueueMock';
import { withSetup } from '@/test/withSetup';

import { useAudioPlayer } from './index';

vi.useFakeTimers();

type CB = (...args: unknown[]) => void;

let onBufferedCb: CB;
let onCanPlayCb: CB;
let onCrossfadeTriggerCb: CB;
let onEndedCb: CB;
let onErrorCb: CB;
let onPauseCb: CB;
let onPlayCb: CB;
let onStalledCb: CB;
let onTimeupdateCb: CB;
let onWaitingCb: CB;

const {
  applyReplayGainMock,
  changePlaybackRateMock,
  crossfadeToElementMock,
  crossfadeToMock,
  destroyMock,
  loadFromElementMock,
  loadMock,
  onBufferedMock,
  onCanPlayMock,
  onCrossfadeTriggerMock,
  onEndedMock,
  onErrorMock,
  onPauseMock,
  onPlayMock,
  onStalledMock,
  onTimeupdateMock,
  onWaitingMock,
  pauseMock,
  playMock,
  setCrossfadeDurationMock,
  setCurrentTimeMock,
  setVolumeMock,
  unloadMock,
} = vi.hoisted(() => ({
  applyReplayGainMock: vi.fn(),
  changePlaybackRateMock: vi.fn(),
  crossfadeToElementMock: vi.fn(),
  crossfadeToMock: vi.fn(),
  destroyMock: vi.fn(),
  loadFromElementMock: vi.fn(),
  loadMock: vi.fn(),
  onBufferedMock: vi.fn((cb) => (onBufferedCb = cb)),
  onCanPlayMock: vi.fn((cb) => (onCanPlayCb = cb)),
  onCrossfadeTriggerMock: vi.fn((cb) => (onCrossfadeTriggerCb = cb)),
  onEndedMock: vi.fn((cb) => (onEndedCb = cb)),
  onErrorMock: vi.fn((cb) => (onErrorCb = cb)),
  onPauseMock: vi.fn((cb) => (onPauseCb = cb)),
  onPlayMock: vi.fn((cb) => (onPlayCb = cb)),
  onStalledMock: vi.fn((cb) => (onStalledCb = cb)),
  onTimeupdateMock: vi.fn((cb) => (onTimeupdateCb = cb)),
  onWaitingMock: vi.fn((cb) => (onWaitingCb = cb)),
  pauseMock: vi.fn(),
  playMock: vi.fn(() => Promise.resolve()),
  setCrossfadeDurationMock: vi.fn(),
  setCurrentTimeMock: vi.fn(),
  setVolumeMock: vi.fn(),
  unloadMock: vi.fn(),
}));

mockNuxtImport('AudioPlayer', () =>
  vi.fn(function () {
    return {
      applyReplayGain: applyReplayGainMock,
      changePlaybackRate: changePlaybackRateMock,
      crossfadeTo: crossfadeToMock,
      crossfadeToElement: crossfadeToElementMock,
      destroy: destroyMock,
      load: loadMock,
      loadFromElement: loadFromElementMock,
      onBuffered: onBufferedMock,
      onCanPlay: onCanPlayMock,
      onCrossfadeTrigger: onCrossfadeTriggerMock,
      onEnded: onEndedMock,
      onError: onErrorMock,
      onPause: onPauseMock,
      onPlay: onPlayMock,
      onStalled: onStalledMock,
      onTimeupdate: onTimeupdateMock,
      onWaiting: onWaitingMock,
      pause: pauseMock,
      play: playMock,
      setCrossfadeDuration: setCrossfadeDurationMock,
      setCurrentTime: setCurrentTimeMock,
      setVolume: setVolumeMock,
      unload: unloadMock,
    };
  }),
);

const { clearPreloaderMock, consumeMock, preloadMock, pruneMock } = vi.hoisted(
  () => ({
    clearPreloaderMock: vi.fn(),
    consumeMock: vi.fn(),
    preloadMock: vi.fn(),
    pruneMock: vi.fn(),
  }),
);

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

const scrobbleMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
  scrobble: scrobbleMock,
}));

const {
  setMediaSessionMetadataMock,
  setMediaSessionPlaybackStateMock,
  setMediaSessionPositionStateMock,
  setupMediaSessionHandlersMock,
} = vi.hoisted(() => ({
  setMediaSessionMetadataMock: vi.fn(),
  setMediaSessionPlaybackStateMock: vi.fn(),
  setMediaSessionPositionStateMock: vi.fn(),
  setupMediaSessionHandlersMock: vi.fn(),
}));

mockNuxtImport('useMediaSession', (original) => () => ({
  ...original(),
  setMediaSessionMetadata: setMediaSessionMetadataMock,
  setMediaSessionPlaybackState: setMediaSessionPlaybackStateMock,
  setMediaSessionPositionState: setMediaSessionPositionStateMock,
  setupMediaSessionHandlers: setupMediaSessionHandlersMock,
}));

const { createBookmarkMock, deleteBookmarkMock, getBookmarkPositionMock } =
  vi.hoisted(() => ({
    createBookmarkMock: vi.fn(),
    deleteBookmarkMock: vi.fn(),
    getBookmarkPositionMock: vi.fn(),
  }));

mockNuxtImport('useBookmark', (original) => () => ({
  ...original(),
  createBookmark: createBookmarkMock,
  deleteBookmark: deleteBookmarkMock,
  getBookmarkPosition: getBookmarkPositionMock,
}));

const loadDashboardAlbumsMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAlbum', (original) => () => ({
  ...original(),
  loadDashboardAlbums: loadDashboardAlbumsMock,
}));

const deletePodcastEpisodeGloballyMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePodcastCleanup', (original) => () => ({
  ...original(),
  deletePodcastEpisodeGlobally: deletePodcastEpisodeGloballyMock,
}));

const crossfadeDurationMock = ref(0);
const crossfadeEnabledMock = ref(false);
const deletePodcastOnEndMock = ref(false);
const scrobbleEnabledMock = ref(true);
const replayGainModeMock = ref<ReplayGainMode>('off');
const setReplayGainModeMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSettings', (original) => () => ({
  ...original(),
  crossfadeDuration: crossfadeDurationMock,
  crossfadeEnabled: crossfadeEnabledMock,
  deletePodcastOnEnd: deletePodcastOnEndMock,
  replayGainMode: replayGainModeMock,
  scrobbleEnabled: scrobbleEnabledMock,
  setReplayGainMode: setReplayGainModeMock,
}));

const handleErrorMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useErrorHandler', (original) => () => ({
  ...original(),
  handleError: handleErrorMock,
}));

const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const setLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const getLocalStorageMock = vi.hoisted(() =>
  vi.fn<() => null | typeof AUDIO_PLAYER_DEFAULT_STATES>(() => null),
);

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  getStreamUrl: vi.fn((path) => path),
}));

const {
  addTracksMock,
  currentTrackMock,
  enrichTracksWithPositionsMock,
  hasCurrentTrackMock,
  isLastTrackMock,
  isPodcastEpisodeMock,
  isTrackMock,
  navigateQueueMock,
  queueListMock,
  removeTrackMock,
  reorderQueueTracksMock,
  shuffleQueueMock,
  unshuffleQueueMock,
  updateCurrentTrackPositionMock,
} = useQueueMock();

const queueTracks = getFormattedQueueTracksMock(6);
const queueTrack = getFormattedQueueTracksMock()[0];

describe('useAudioPlayer', () => {
  let result: Awaited<
    ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>
  >;

  beforeAll(async () => {
    navigateQueueMock.mockReturnValue(queueTrack);
    result = await withSetup(useAudioPlayer);
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
        getLocalStorageMock.mockReturnValue(AUDIO_PLAYER_DEFAULT_STATES);
        result = await withSetup(useAudioPlayer);
        result.composable.restoreAudioPlayerState();
      });

      it('calls the onTimeupdate function', () => {
        expect(onTimeupdateMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onCanPlay function', () => {
        expect(onCanPlayMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onBuffered function', () => {
        expect(onBufferedMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onStalled function', () => {
        expect(onStalledMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onWaiting function', () => {
        expect(onWaitingMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onEnded function', () => {
        expect(onEndedMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onPause function', () => {
        expect(onPauseMock).toHaveBeenCalledWith(expect.any(Function));
      });

      it('calls the onPlay function', () => {
        expect(onPlayMock).toHaveBeenCalledWith(expect.any(Function));
      });

      describe('when the getLocalStorage function returns the default state', () => {
        it('sets the correct bufferedDuration value', () => {
          expect(result.composable.bufferedDuration.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
          );
        });

        it('sets the correct currentTime value', () => {
          expect(result.composable.currentTime.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.currentTime,
          );
        });

        it('sets the correct isBuffering value', () => {
          expect(result.composable.isBuffering.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
          );
        });

        it('sets the correct isPlaying value', () => {
          expect(result.composable.isPlaying.value).toBe(false);
        });

        it('sets the correct playbackRate value', () => {
          expect(result.composable.playbackRate.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
          );
        });

        it('sets the correct repeat value', () => {
          expect(result.composable.repeat.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.repeat,
          );
        });

        it('sets the correct shuffle value', () => {
          expect(result.composable.shuffle.value).toBe(
            AUDIO_PLAYER_DEFAULT_STATES.shuffle,
          );
        });

        it('sets the correct volume value', () => {
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

          result = await withSetup(useAudioPlayer);
          result.composable.restoreAudioPlayerState();
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

            result = await withSetup(useAudioPlayer);
            result.composable.restoreAudioPlayerState();
          });

          it('calls the audio load function with the correct parameters', () => {
            expect(loadMock).toHaveBeenCalledWith(
              currentTrackMock.value.streamUrlId,
              currentTrackMock.value.duration,
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

              result = await withSetup(useAudioPlayer);
              result.composable.restoreAudioPlayerState();
            });

            it('calls the setCurrentTime function with the correct parameters', () => {
              expect(setCurrentTimeMock).toHaveBeenCalledWith(7);
            });

            describe('when the currentTrack value has a position', () => {
              beforeAll(async () => {
                currentTrackMock.value.position = 7;
                result = await withSetup(useAudioPlayer);
                result.composable.restoreAudioPlayerState();
              });

              it('calls the setCurrentTime function with the correct parameters', () => {
                expect(setCurrentTimeMock).toHaveBeenCalledWith(7);
              });
            });

            describe('when the currentTrack value does not have a position', () => {
              beforeAll(async () => {
                currentTrackMock.value.position = undefined;
                result = await withSetup(useAudioPlayer);
                result.composable.restoreAudioPlayerState();
              });

              it('calls the setCurrentTime function with the correct parameters', () => {
                expect(setCurrentTimeMock).toHaveBeenCalledWith(0);
              });
            });
          });

          describe('when the queueList value is not an empty array', () => {
            beforeEach(() => {
              queueListMock.value = getFormattedQueueTracksMock(5);
              result.composable.restoreAudioPlayerState();
            });

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
              result = await withSetup(useAudioPlayer);
              result.composable.restoreAudioPlayerState();
            });

            it('does not call the audio preloader preload function', () => {
              expect(preloadMock).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('when the playerStateRestored value is true', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        useState(STATE_KEYS.playerStateRestored).value = true;
        result.composable.restoreAudioPlayerState();
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

    describe('when onStalled event is called', () => {
      beforeAll(() => {
        onStalledCb();
      });

      it('sets the correct isBuffering value', () => {
        expect(result.composable.isBuffering.value).toBe(true);
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

    describe('when onError event is called', () => {
      beforeAll(() => {
        const event = {
          target: {
            error: {
              message: 'Decoder error',
            },
          },
        };

        onErrorCb(event);
      });

      it('calls the handleError function with the correct parameters', () => {
        expect(handleErrorMock).toHaveBeenCalledWith(
          {
            target: {
              error: {
                message: 'Decoder error',
              },
            },
          },
          'audio',
        );
      });

      it('sets the correct isBuffering value', () => {
        expect(result.composable.isBuffering.value).toBe(false);
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
        beforeAll(() => {
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

    describe('when the audio element resumes playback after an external pause', () => {
      describe('when a pause event fires while the play promise is pending', () => {
        let resolvePlay: () => void;
        let resumePromise: Promise<unknown>;

        beforeAll(() => {
          vi.clearAllMocks();

          result.composable.isPlaying.value = true;
          onPauseCb();

          const pendingPlayPromise = new Promise<void>((resolve) => {
            resolvePlay = () => resolve();
          });

          playMock.mockImplementationOnce(() => pendingPlayPromise);

          resumePromise = Promise.resolve(onPlayCb());

          onPauseCb();
        });

        it('calls the pause function 2 times', () => {
          expect(pauseMock).toHaveBeenCalledTimes(2);
        });

        describe('when the pending play promise resolves', () => {
          beforeAll(async () => {
            resolvePlay();
            await resumePromise;
          });

          it('sets the correct isPlaying value', () => {
            expect(result.composable.isPlaying.value).toBe(true);
          });
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

      it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
        expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(0);
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

        it('calls the deleteBookmark function with the correct parameters', () => {
          expect(deleteBookmarkMock).toHaveBeenCalledWith(
            currentTrackMock.value.id,
            false,
          );
        });
      });

      describe('when the deletePodcastOnEnd value is true', () => {
        beforeAll(() => {
          deletePodcastOnEndMock.value = true;
          onEndedCb();
        });

        it('calls the deletePodcastEpisodeGlobally function with the correct parameters', () => {
          expect(deletePodcastEpisodeGloballyMock).toHaveBeenCalledWith(
            currentTrackMock.value,
            true,
          );
        });

        describe('when the queueList value is an empty array', () => {
          beforeAll(() => {
            vi.clearAllMocks();
            queueListMock.value = [];
            onEndedCb();
          });

          it('calls the audio unload function', () => {
            expect(unloadMock).toHaveBeenCalled();
          });

          it('calls the audio preloader clear function', () => {
            expect(clearPreloaderMock).toHaveBeenCalled();
          });

          it('does not call the audio load function', () => {
            expect(loadMock).not.toHaveBeenCalled();
          });

          it('does not call the audio pause function', () => {
            expect(pauseMock).not.toHaveBeenCalled();
          });
        });

        describe('when the isLastTrack value is false', () => {
          beforeAll(() => {
            vi.clearAllMocks();
            queueListMock.value = getFormattedQueueTracksMock(5);
            isLastTrackMock.value = false;
            onEndedCb();
          });

          it('does not call the audio load function', () => {
            expect(loadMock).not.toHaveBeenCalled();
          });

          it('does not call the audio play function', () => {
            expect(playMock).not.toHaveBeenCalled();
          });

          it('does not call the audio pause function', () => {
            expect(pauseMock).not.toHaveBeenCalled();
          });
        });

        describe('when the isLastTrack value is true', () => {
          beforeAll(() => {
            vi.clearAllMocks();
            isLastTrackMock.value = true;
            onEndedCb();
          });

          it('does not call the audio load function', () => {
            expect(loadMock).not.toHaveBeenCalled();
          });

          it('does not call the audio play function', () => {
            expect(playMock).not.toHaveBeenCalled();
          });

          it('calls the audio pause function', () => {
            expect(pauseMock).toHaveBeenCalled();
          });
        });
      });

      describe('when the deletePodcastOnEnd value is false', () => {
        beforeAll(() => {
          deletePodcastOnEndMock.value = false;
          vi.clearAllMocks();
          onEndedCb();
        });

        it('does not call the deletePodcastEpisodeGlobally function', () => {
          expect(deletePodcastEpisodeGloballyMock).not.toHaveBeenCalled();
        });

        describe('when the repeat value is 1', () => {
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

        describe('when the repeat value is -1', () => {
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

          describe('when the isLastTrack value is true', () => {
            beforeAll(() => {
              isLastTrackMock.value = true;
              vi.clearAllMocks();
              onEndedCb();
            });

            it('calls the audio pause function', () => {
              expect(pauseMock).toHaveBeenCalled();
            });
          });
        });

        describe('when the repeat value is infinity', () => {
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
  });

  describe('when the crossfade trigger callback is invoked', () => {
    beforeAll(() => {
      vi.clearAllMocks();
    });

    describe('when the isTrack value is false', () => {
      beforeAll(() => {
        isTrackMock.value = false;
        onCrossfadeTriggerCb();
      });

      it('does not call the navigateQueue function', () => {
        expect(navigateQueueMock).not.toHaveBeenCalled();
      });
    });

    describe('when the repeat value is one', () => {
      beforeAll(() => {
        isTrackMock.value = true;
        result.composable.repeat.value = REPEAT_MODE.one;
        onCrossfadeTriggerCb();
      });

      it('does not call the navigateQueue function', () => {
        expect(navigateQueueMock).not.toHaveBeenCalled();
      });
    });

    describe('when the isLastTrack value is true and repeat is not all', () => {
      beforeAll(() => {
        result.composable.repeat.value = REPEAT_MODE.off;
        isLastTrackMock.value = true;
        onCrossfadeTriggerCb();
      });

      it('does not call the navigateQueue function', () => {
        expect(navigateQueueMock).not.toHaveBeenCalled();
      });
    });

    describe('when all guards pass', () => {
      beforeAll(() => {
        isLastTrackMock.value = false;
        result.composable.repeat.value = REPEAT_MODE.all;
        result.composable.currentTime.value = 100;
        vi.clearAllMocks();
        navigateQueueMock.mockReturnValueOnce(queueTrack);
        onCrossfadeTriggerCb();
      });

      it('calls the loadDashboardAlbums function', () => {
        expect(loadDashboardAlbumsMock).toHaveBeenCalled();
      });

      it('calls the navigateQueue function with the correct parameters', () => {
        expect(navigateQueueMock).toHaveBeenCalledWith('next');
      });

      it('calls the audio crossfadeTo function', () => {
        expect(crossfadeToMock).toHaveBeenCalled();
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      describe('when the scrobble conditions are met', () => {
        beforeAll(() => {
          result.composable.repeat.value = REPEAT_MODE.all;
          result.composable.currentTime.value = 100;
          vi.clearAllMocks();
          navigateQueueMock.mockReturnValueOnce(queueTrack);
          onCrossfadeTriggerCb();
        });

        it('calls the scrobble function with the correct parameters', () => {
          expect(scrobbleMock).toHaveBeenCalledWith(queueTrack.id);
        });
      });
    });
  });

  describe('when the addTracksToQueue function is called', () => {
    beforeAll(() => {
      result.composable.addTracksToQueue(queueTracks);
    });

    it('calls the enrichTracksWithPositions function with the correct parameters', () => {
      expect(enrichTracksWithPositionsMock).toHaveBeenCalledWith(queueTracks);
    });

    it('calls the addTracks function with the correct parameters', () => {
      expect(addTracksMock).toHaveBeenCalledWith(queueTracks);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.any(Object),
      );
    });

    describe('when the queueList value length is 0', () => {
      beforeAll(() => {
        vi.clearAllMocks();
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

      it('does not call the audio play function', () => {
        expect(playMock).not.toHaveBeenCalled();
      });

      it('does not call the audio pause function', () => {
        expect(pauseMock).not.toHaveBeenCalled();
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
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.any(Object),
      );
    });
  });

  describe('when the playTracks function is called', () => {
    beforeAll(() => {
      result.composable.playTracks(queueTracks);
    });

    it('calls the enrichTracksWithPositions function with the correct parameters', () => {
      expect(enrichTracksWithPositionsMock).toHaveBeenCalledWith(queueTracks);
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
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.any(Object),
      );
    });

    describe(`when the track is a ${MEDIA_TYPE.podcastEpisode}`, () => {
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
    });

    describe(`when the track is not ${MEDIA_TYPE.podcastEpisode}`, () => {
      describe('when the track value does have a position', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          isPodcastEpisodeMock.value = false;
          navigateQueueMock.mockReturnValueOnce(
            getFormattedQueueTracksMock(1, {
              position: 10,
            })[0],
          );

          result.composable.playTracks(queueTracks);
        });

        it('does not call the setCurrentTime function', () => {
          expect(setCurrentTimeMock).not.toHaveBeenCalled();
        });
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

    describe.each([
      [MEDIA_TYPE.track, 0, true],
      [MEDIA_TYPE.radioStation, 0, false],
      [MEDIA_TYPE.podcastEpisode, 1, false],
    ])(
      'when the track type is %s',
      (type, createBookmarkCalledLength, isMusicTrack) => {
        beforeAll(async () => {
          result.composable.currentTime.value = 80;

          const tracksWithType = getFormattedQueueTracksMock(1, {
            type,
          });

          isPodcastEpisodeMock.value = type === MEDIA_TYPE.podcastEpisode;

          vi.clearAllMocks();

          await result.composable.playTracks(tracksWithType);

          vi.advanceTimersByTime(SAVE_INTERVAL * 2);
        });

        it(`${isMusicTrack ? 'calls' : 'does not call'} the applyReplayGain function with mode-based arguments`, () => {
          if (isMusicTrack) {
            expect(applyReplayGainMock).toHaveBeenCalledWith(
              replayGainModeMock.value,
              undefined,
              undefined,
              undefined,
            );
          } else {
            expect(applyReplayGainMock).toHaveBeenCalledWith(
              'off',
              undefined,
              undefined,
              undefined,
            );
          }
        });

        it(`${createBookmarkCalledLength ? 'calls' : 'does not call'} the createBookmark function`, () => {
          if (createBookmarkCalledLength) {
            expect(createBookmarkMock).toHaveBeenCalledTimes(
              createBookmarkCalledLength,
            );
            expect(createBookmarkMock).toHaveBeenCalledWith(
              currentTrackMock.value.id,
              80,
            );
          } else {
            expect(createBookmarkMock).not.toHaveBeenCalled();
          }
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
      },
    );

    describe('when the isTrack value is false', () => {
      beforeAll(() => {
        vi.advanceTimersByTime(SAVE_INTERVAL * 2);
      });

      it('does not call the scrobble function', () => {
        expect(scrobbleMock).not.toHaveBeenCalled();
      });
    });

    describe('when the isTrack value is true', () => {
      describe('when currentTime is less than or equal to 80% of track duration', () => {
        beforeAll(() => {
          isTrackMock.value = true;
          result.composable.currentTime.value = 80;

          vi.advanceTimersByTime(SAVE_INTERVAL);
        });

        it('does not call the scrobble function', () => {
          expect(scrobbleMock).not.toHaveBeenCalled();
        });
      });

      describe('when currentTime is greater than 80% of track duration', () => {
        describe('when the scrobbleEnabled value is false', () => {
          beforeAll(() => {
            scrobbleEnabledMock.value = false;
            result.composable.currentTime.value = 100;
            vi.advanceTimersByTime(SAVE_INTERVAL);
          });

          afterAll(() => {
            scrobbleEnabledMock.value = true;
          });

          it('does not call the scrobble function', () => {
            expect(scrobbleMock).not.toHaveBeenCalled();
          });
        });

        describe('when the scrobbleEnabled value is true', () => {
          beforeAll(() => {
            result.composable.currentTime.value = 100;
            vi.advanceTimersByTime(SAVE_INTERVAL);
          });

          it('calls the scrobble function with the correct parameters', () => {
            expect(scrobbleMock).toHaveBeenCalledWith(queueTrack.id);
          });
        });
      });
    });

    describe('when the play function rejects with an interrupted error', () => {
      beforeAll(async () => {
        vi.clearAllMocks();
        playMock.mockRejectedValueOnce(
          new DOMException(
            'The play() request was interrupted by a call to pause().',
            'AbortError',
          ),
        );

        await result.composable.playTracks(queueTracks);
      });

      it('does not call the handleError function', () => {
        expect(handleErrorMock).not.toHaveBeenCalled();
      });

      it('sets the correct isPlaying value', () => {
        expect(result.composable.isPlaying.value).toBe(true);
      });
    });

    describe('when the play function rejects with an error', () => {
      beforeAll(async () => {
        vi.clearAllMocks();
        playMock.mockRejectedValueOnce(
          new DOMException(
            'The element has no supported sources.',
            'NotSupportedError',
          ),
        );

        await result.composable.playTracks(queueTracks);
      });

      afterAll(async () => {
        // Reset the state to avoid affecting other tests.
        await result.composable.playTracks(queueTracks);
      });

      it('calls the handleError function with the correct parameters', () => {
        expect(handleErrorMock).toHaveBeenCalledWith(
          new DOMException(
            'The element has no supported sources.',
            'NotSupportedError',
          ),
          'audio',
        );
      });

      it('sets the correct isPlaying value', () => {
        expect(result.composable.isPlaying.value).toBe(false);
      });

      it('calls the audio pause function', () => {
        expect(pauseMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the togglePlay function is called', () => {
    beforeAll(async () => {
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

  describe('when the playCurrentTrackFromQueue function is called', () => {
    beforeAll(async () => {
      await result.composable.playCurrentTrackFromQueue();
    });

    it('calls the audio unload function', () => {
      expect(unloadMock).toHaveBeenCalled();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalled();
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });

    it('sets the correct currentTime value', () => {
      expect(result.composable.currentTime.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.currentTime,
      );
    });

    it('calls the setMediaSessionMetadata function', () => {
      expect(setMediaSessionMetadataMock).toHaveBeenCalled();
    });

    it('calls the updateCurrentTrackPosition function with the correct parameters', () => {
      expect(updateCurrentTrackPositionMock).toHaveBeenCalledWith(0);
    });

    it('does not call the createBookmark function', () => {
      expect(createBookmarkMock).not.toHaveBeenCalled();
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(async () => {
        isPodcastEpisodeMock.value = true;
        vi.clearAllMocks();
        await result.composable.playCurrentTrackFromQueue();
      });

      afterAll(() => {
        isPodcastEpisodeMock.value = false;
      });

      it('calls the audio changePlaybackRate function with the correct parameters', () => {
        expect(changePlaybackRateMock).toHaveBeenCalledWith(
          PLAYBACK_RATES[result.composable.playbackRate.value].speed,
        );
      });
    });
  });

  describe('when removeFromQueue function is called', () => {
    describe('when the removed track is the only track in the queue', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        removeTrackMock.mockReturnValueOnce(1);
        result.composable.removeFromQueue(0);
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
        result.composable.removeFromQueue(0);
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
          result.composable.removeFromQueue(0);
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
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.any(Object),
        );
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
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.any(Object),
        );
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

  describe('when setReplayGainMode function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.setReplayGainMode('track');
    });

    it('calls the settings setReplayGainMode function with the correct parameters', () => {
      expect(setReplayGainModeMock).toHaveBeenCalledWith('track');
    });

    it('calls the applyReplayGain function for the current track', () => {
      expect(applyReplayGainMock).toHaveBeenCalled();
    });

    describe('when the mode is album', () => {
      const peakAlbum = 0.85;

      beforeAll(() => {
        currentTrackMock.value = getFormattedQueueTracksMock(1, {
          peakAlbum,
        })[0];
        replayGainModeMock.value = 'album';
        vi.clearAllMocks();
        result.composable.setReplayGainMode('album');
      });

      afterAll(() => {
        replayGainModeMock.value = 'off';
        currentTrackMock.value = getFormattedQueueTracksMock()[0];
      });

      it('passes peakAlbum as the peak argument', () => {
        expect(applyReplayGainMock).toHaveBeenCalledWith(
          'album',
          undefined,
          undefined,
          peakAlbum,
        );
      });
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

  describe('when the cycleRepeat function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.cycleRepeat();
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.any(Object),
      );
    });
  });

  describe('when the resetRepeat function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.resetRepeat();
    });

    it('sets the correct repeat value', () => {
      expect(result.composable.repeat.value).toBe(REPEAT_MODE.off);
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
        expect.objectContaining({
          repeat: REPEAT_MODE.off,
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

    it('calls the unshuffleQueue function', () => {
      expect(unshuffleQueueMock).toHaveBeenCalled();
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

      describe('when the currentTime value is the default value', () => {
        beforeAll(() => {
          isPodcastEpisodeMock.value = true;
          result.composable.currentTime.value = 0;
          vi.clearAllMocks();
          navigateQueueMock.mockReturnValueOnce(queueTrack);
          result.composable.playNextTrack();
        });

        it('does not call the createBookmark function', () => {
          expect(createBookmarkMock).not.toHaveBeenCalled();
        });

        it('calls the updateCurrentTrackPosition function', () => {
          expect(updateCurrentTrackPositionMock).toHaveBeenCalled();
        });
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
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.any(Object),
        );
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
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.player,
          expect.any(Object),
        );
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

    it('calls the audio destroy function', () => {
      expect(destroyMock).toHaveBeenCalled();
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

    it('calls the updateCurrentTrackPosition function', () => {
      expect(updateCurrentTrackPositionMock).toHaveBeenCalled();
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
