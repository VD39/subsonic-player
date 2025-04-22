import { getFormattedQueueTracksMock } from '@/test/helpers';
import { withSetup } from '@/test/withSetup';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAudioPlayer } from './index';

vi.useFakeTimers();

const setPositionStateMock = vi.fn();

Object.defineProperty(window.navigator, 'mediaSession', {
  configurable: true,
  value: {
    playbackState: '',
    setActionHandler: vi.fn(),
    setPositionState: setPositionStateMock,
  },
  writable: true,
});

window.MediaMetadata = vi.fn();

type CB = (...args: unknown[]) => void;

let onBufferedCb: CB;
let onCanPlayCb: CB;
let onEndedCb: CB;
let onLoadedMetadataCb: CB;
let onTimeupdateCb: CB;
let onWaitingCb: CB;

const changePlaybackRateMock = vi.fn();
const setVolumeMock = vi.fn();
const loadMock = vi.fn();
const onBufferedMock = vi.fn((cb) => (onBufferedCb = cb));
const onCanPlayMock = vi.fn((cb) => (onCanPlayCb = cb));
const onEndedMock = vi.fn((cb) => (onEndedCb = cb));
const onLoadedMetadataMock = vi.fn((cb) => (onLoadedMetadataCb = cb));
const onTimeupdateMock = vi.fn((cb) => (onTimeupdateCb = cb));
const onWaitingMock = vi.fn((cb) => (onWaitingCb = cb));
const pauseMock = vi.fn();
const playMock = vi.fn(() => Promise.resolve());
const setCurrentTimeMock = vi.fn();
const unloadMock = vi.fn();

mockNuxtImport('AudioPlayer', () =>
  vi.fn(() => ({
    changePlaybackRate: changePlaybackRateMock,
    load: loadMock,
    onBuffered: onBufferedMock,
    onCanPlay: onCanPlayMock,
    onEnded: onEndedMock,
    onLoadedMetadata: onLoadedMetadataMock,
    onTimeupdate: onTimeupdateMock,
    onWaiting: onWaitingMock,
    pause: pauseMock,
    play: playMock,
    setCurrentTime: setCurrentTimeMock,
    setVolume: setVolumeMock,
    unload: unloadMock,
  })),
);

const resetQueueStateMock = vi.fn();

mockNuxtImport('useQueue', () => () => ({
  resetQueueState: resetQueueStateMock,
}));

mockNuxtImport('useMediaLibrary', () => () => ({
  scrobble: vi.fn(),
}));

const createBookmarkMock = vi.fn();
const deleteBookmarkMock = vi.fn();

mockNuxtImport('useBookmarks', () => () => ({
  createBookmark: createBookmarkMock,
  deleteBookmark: deleteBookmarkMock,
}));

const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const setLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const getLocalStorageMock = vi.hoisted(() =>
  vi.fn<() => null | typeof AUDIO_PLAYER_DEFAULT_STATES>(() => null),
);

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

const queueTracks = getFormattedQueueTracksMock(5);
const queueTracksMore = getFormattedQueueTracksMock(15);
const queueTrack = getFormattedQueueTracksMock()[0];

describe('useAudioPlayer', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>;

  beforeAll(() => {
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

  it('sets the default duration value', () => {
    expect(result.composable.duration.value).toBe(
      AUDIO_PLAYER_DEFAULT_STATES.duration,
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

  it('sets the default queueList value', () => {
    expect(result.composable.queueList.value).toEqual(
      AUDIO_PLAYER_DEFAULT_STATES.queueList,
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

  it('sets the correct hasNextTrack value', () => {
    expect(result.composable.hasNextTrack.value).toBe(false);
  });

  it('sets the correct hasPreviousTrack value', () => {
    expect(result.composable.hasPreviousTrack.value).toBe(false);
  });

  it('sets the the correct showMediaPlayer value', () => {
    expect(result.composable.showMediaPlayer.value).toBe(false);
  });

  it('sets the the correct currentTrack value', () => {
    expect(result.composable.currentTrack.value).toEqual({});
  });

  it('sets the the correct isTrack value', () => {
    expect(result.composable.isTrack.value).toBe(false);
  });

  it('sets the the correct isPodcastEpisode value', () => {
    expect(result.composable.isPodcastEpisode.value).toBe(false);
  });

  it('sets the the correct isRadioStation value', () => {
    expect(result.composable.isRadioStation.value).toBe(false);
  });

  describe('when getLocalStorage returns data', () => {
    const queueList = getFormattedQueueTracksMock(2);

    beforeAll(() => {
      getLocalStorageMock.mockReturnValue({
        ...AUDIO_PLAYER_DEFAULT_STATES,
        currentQueueIndex: 1,
        currentTime: 55,
        duration: 100,
        playbackRate: 0.5,
        queueList,
        repeat: -1,
        shuffle: false,
        volume: 0.5,
      });

      result = withSetup(useAudioPlayer);
    });

    it('sets the correct duration value', () => {
      expect(result.composable.duration.value).toBe(100);
    });

    it('sets the correct queueList value', () => {
      expect(result.composable.queueList.value).toEqual(queueList);
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

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith(queueList[1].streamUrlId);
    });

    it('calls the audio setVolume function', () => {
      expect(setVolumeMock).toHaveBeenCalledWith(0.5);
    });

    it('calls the audio setCurrentTime function', () => {
      expect(setCurrentTimeMock).toHaveBeenCalledWith(55);
    });

    it('calls the audio changePlaybackRate function', () => {
      expect(changePlaybackRateMock).toHaveBeenCalledWith(0.5);
    });
  });

  describe.each([
    [MEDIA_TYPE.track, true, false, false, 0],
    [MEDIA_TYPE.radioStation, false, false, true, 0],
    [MEDIA_TYPE.podcastEpisode, false, true, false, 2],
  ])(
    'when track type is %s',
    (
      type,
      isTrack,
      isPodcastEpisode,
      isRadioStation,
      createBookmarkCalledLength,
    ) => {
      beforeAll(async () => {
        await result.composable.playTracks([
          {
            ...queueTrack,
            type,
          },
        ]);

        vi.advanceTimersByTime(SAVE_INTERVAL * 2);
      });

      afterAll(() => {
        result.composable.queueList.value = [];
      });

      it('sets the the correct isTrack value', () => {
        expect(result.composable.isTrack.value).toBe(isTrack);
      });

      it('sets the the correct isPodcastEpisode value', () => {
        expect(result.composable.isPodcastEpisode.value).toBe(isPodcastEpisode);
      });

      it('sets the the correct isRadioStation value', () => {
        expect(result.composable.isRadioStation.value).toBe(isRadioStation);
      });

      it(`${createBookmarkCalledLength ? 'calls' : 'does not call'} the createBookmark function`, () => {
        expect(createBookmarkMock).toHaveBeenCalledTimes(
          createBookmarkCalledLength,
        );
      });
    },
  );

  describe('when addTrackToQueue function is called', () => {
    beforeAll(() => {
      result.composable.addTrackToQueue(queueTrack);
    });

    it('adds to the queueList value', () => {
      expect(result.composable.queueList.value).toEqual([queueTrack]);
    });

    it('sets the the correct showMediaPlayer value', () => {
      expect(result.composable.showMediaPlayer.value).toBe(true);
    });

    it('sets the the correct currentTrack value', () => {
      expect(result.composable.currentTrack.value).toEqual(queueTrack);
    });

    it('sets the correct hasNextTrack value', () => {
      expect(result.composable.hasNextTrack.value).toBe(false);
    });

    it('sets the correct hasPreviousTrack value', () => {
      expect(result.composable.hasPreviousTrack.value).toBe(false);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.playerState,
        expect.objectContaining({
          currentQueueIndex: -1,
          queueList: [queueTrack],
        }),
      );
    });
  });

  describe('when addTracksToQueue function is called', () => {
    beforeAll(() => {
      result.composable.addTracksToQueue([queueTracks[1], queueTracks[2]]);
    });

    it('adds to the queueList value', () => {
      expect(result.composable.queueList.value).toEqual([
        queueTrack,
        queueTracks[1],
        queueTracks[2],
      ]);
    });

    it('sets the correct hasNextTrack value', () => {
      expect(result.composable.hasNextTrack.value).toBe(true);
    });

    it('sets the correct hasPreviousTrack value', () => {
      expect(result.composable.hasPreviousTrack.value).toBe(false);
    });

    describe('when queueList length is 0', () => {
      it('calls the audio load function', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTrack.streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });

    describe('when queueList length is greater than 0', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.addTracksToQueue([queueTrack]);
      });

      afterAll(() => {
        result.composable.queueList.value = [queueTrack];
      });

      it('does not call the audio load function', () => {
        expect(loadMock).not.toHaveBeenCalled();
      });

      it('does not call the audio play function', () => {
        expect(playMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when playTrackFromQueueList function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = [...queueTracks];
      result.composable.playTrackFromQueueList(4);
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith(queueTracks[4].streamUrlId);
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });
  });

  describe('when removeTrackFromQueueList function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = [...queueTracks];
    });

    describe('when id is not found in queueList', () => {
      beforeAll(() => {
        result.composable.removeTrackFromQueueList('idNotFound');
      });

      it('does not change the queueList', () => {
        expect(result.composable.queueList.value).toEqual(queueTracks);
      });
    });

    describe('when id is found in queueList', () => {
      describe('when id is not the same as the currentTrack', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTracks[1].id);
        });

        it('removes the item from the queueList', () => {
          expect(result.composable.queueList.value).toEqual([
            queueTracks[0],
            queueTracks[2],
            queueTracks[3],
            queueTracks[4],
          ]);
        });

        it('does not call the audio unload function', () => {
          expect(unloadMock).not.toHaveBeenCalled();
        });

        it('does not call the audio load function', () => {
          expect(loadMock).not.toHaveBeenCalled();
        });

        it('does not update the currentTrack value', () => {
          expect(result.composable.currentTrack.value.id).toBe(
            queueTracks[4].id,
          );
        });
      });

      describe('when id index greater than the currentQueueIndex value', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTracks[3].id);
        });

        it('removes the item from the queueList', () => {
          expect(result.composable.queueList.value).toEqual([
            queueTracks[0],
            queueTracks[2],
            queueTracks[4],
          ]);
        });

        it('does not call the audio unload function', () => {
          expect(unloadMock).not.toHaveBeenCalled();
        });

        it('does not call the audio load function', () => {
          expect(loadMock).not.toHaveBeenCalled();
        });

        it('does not update the currentTrack value', () => {
          expect(result.composable.currentTrack.value.id).toBe(
            queueTracks[4].id,
          );
        });
      });

      describe('when id is the same as the currentTrack', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTracks[4].id);
        });

        it('removes the item from the queueList', () => {
          expect(result.composable.queueList.value).toEqual([
            queueTracks[0],
            queueTracks[2],
          ]);
        });

        it('calls the audio unload function', () => {
          expect(unloadMock).toHaveBeenCalled();
        });

        it('calls the audio load function', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[2].streamUrlId);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        it('updates the currentTrack value to correct value', () => {
          expect(result.composable.currentTrack.value.id).toBe(
            queueTracks[2].id,
          );
        });
      });

      describe('when the selected track is the last track in queueList', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTracks[2].id);
        });

        it('removes the item from the queueList', () => {
          expect(result.composable.queueList.value).toEqual([queueTracks[0]]);
        });

        it('calls the audio unload function', () => {
          expect(unloadMock).toHaveBeenCalled();
        });

        it('calls the audio load function', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        it('updates the currentTrack value', () => {
          expect(result.composable.currentTrack.value.id).toBe(
            queueTracks[0].id,
          );
        });
      });

      describe('when queueList contains only a single value', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTracks[0].id);
        });

        it('removes the item from the queueList', () => {
          expect(result.composable.queueList.value).toEqual([]);
        });

        it('calls the audio unload function', () => {
          expect(unloadMock).toHaveBeenCalled();
        });

        it('sets the the currentTime value', () => {
          expect(result.composable.currentTime.value).toBe(0);
        });

        it('sets the the bufferedDuration value', () => {
          expect(result.composable.bufferedDuration.value).toBe(0);
        });

        it('sets the correct hasNextTrack value', () => {
          expect(result.composable.hasNextTrack.value).toBe(false);
        });

        it('sets the correct hasPreviousTrack value', () => {
          expect(result.composable.hasPreviousTrack.value).toBe(false);
        });

        it('sets the the duration value', () => {
          expect(result.composable.duration.value).toBe(0);
        });

        it('sets the the correct showMediaPlayer value', () => {
          expect(result.composable.showMediaPlayer.value).toBe(false);
        });

        it('updates the currentTrack value to correct value', () => {
          expect(result.composable.currentTrack.value.id).toBe(undefined);
        });
      });
    });
  });

  describe('when clearQueueList function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = [...queueTracks];
      result.composable.clearQueueList();
    });

    it('clears the queueList value', () => {
      expect(result.composable.queueList.value).toEqual([]);
    });

    it('sets the the currentTrack value', () => {
      expect(result.composable.currentTrack.value).toEqual({});
    });

    it('sets the the currentTime value', () => {
      expect(result.composable.currentTime.value).toBe(0);
    });

    it('sets the the bufferedDuration value', () => {
      expect(result.composable.bufferedDuration.value).toBe(0);
    });

    it('sets the correct hasNextTrack value', () => {
      expect(result.composable.hasNextTrack.value).toBe(false);
    });

    it('sets the correct hasPreviousTrack value', () => {
      expect(result.composable.hasPreviousTrack.value).toBe(false);
    });

    it('sets the the duration value', () => {
      expect(result.composable.duration.value).toBe(0);
    });

    it('sets the the correct showMediaPlayer value', () => {
      expect(result.composable.showMediaPlayer.value).toBe(false);
    });

    it('calls the resetQueueState function', () => {
      expect(resetQueueStateMock).toHaveBeenCalled();
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.playerState,
        expect.objectContaining({
          currentQueueIndex: -1,
          queueList: [],
        }),
      );
    });
  });

  describe('when setVolume function is called', () => {
    beforeAll(() => {
      result.composable.setVolume(0.23);
    });

    it('calls the audio setVolume function', () => {
      expect(setVolumeMock).toHaveBeenCalledWith(0.23);
    });

    it('sets the the playbackRate value', () => {
      expect(result.composable.volume.value).toBe(0.23);
    });
  });

  describe('when setCurrentTime function is called', () => {
    beforeAll(() => {
      result.composable.setCurrentTime(23);
    });

    it('calls the audio setCurrentTime function', () => {
      expect(setCurrentTimeMock).toHaveBeenCalledWith(23);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalled();
    });
  });

  describe('when setPlaybackRate function is called', () => {
    beforeAll(() => {
      result.composable.setPlaybackRate(0.5);
    });

    it('calls the audio changePlaybackRate function', () => {
      expect(changePlaybackRateMock).toHaveBeenCalledWith(0.5);
    });

    it('sets the the playbackRate value', () => {
      expect(result.composable.playbackRate.value).toBe(0.5);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.playerState,
        expect.objectContaining({
          playbackRate: 0.5,
        }),
      );
    });
  });

  describe.each([Number.POSITIVE_INFINITY, 1, -1])(
    'when setRepeat function is called',
    (outcome) => {
      beforeAll(() => {
        result.composable.setRepeat();
      });

      it('sets the the repeat value', () => {
        expect(result.composable.repeat.value).toBe(outcome);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          STATE_NAMES.playerState,
          expect.objectContaining({
            repeat: outcome,
          }),
        );
      });
    },
  );

  describe('when toggleShuffle function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = [...queueTracksMore];
      result.composable.toggleShuffle();
    });

    it('sets the the shuffle value', () => {
      expect(result.composable.shuffle.value).toBe(true);
    });

    it('shuffles the queueList value', () => {
      expect(result.composable.queueList.value).not.toEqual(queueTracksMore);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.playerState,
        expect.objectContaining({
          shuffle: true,
        }),
      );
    });

    describe('when toggleShuffle function is called again', () => {
      beforeAll(() => {
        result.composable.toggleShuffle();
      });

      it('sets the the shuffle value', () => {
        expect(result.composable.shuffle.value).toBe(false);
      });

      it('sets the original queueList value', () => {
        expect(result.composable.queueList.value).toEqual(queueTracksMore);
      });
    });
  });

  describe('when shuffleTracks function is called', () => {
    beforeAll(() => {
      result.composable.shuffleTracks([...queueTracksMore]);
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

    it('sets the the shuffle value', () => {
      expect(result.composable.shuffle.value).toBe(true);
    });

    it('shuffles the queueList value', () => {
      expect(result.composable.queueList.value).not.toEqual(queueTracksMore);
    });
  });

  describe('when toggleVolume function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.toggleVolume(0.5);
    });

    it('calls the audio setVolume function', () => {
      expect(setVolumeMock).toHaveBeenCalledWith(0);
    });

    it('sets the the volume value', () => {
      expect(result.composable.volume.value).toBe(0);
    });

    it('sets the the isMuted value', () => {
      expect(result.composable.isMuted.value).toBe(true);
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.playerState,
        expect.objectContaining({
          volume: 0,
        }),
      );
    });

    describe('when toggleVolume function is called again', () => {
      describe('when volume is greater than 0', () => {
        beforeAll(() => {
          result.composable.toggleVolume(0.5);
        });

        it('calls the audio setVolume function', () => {
          expect(setVolumeMock).toHaveBeenCalledWith(0.5);
        });

        it('sets the the volume value', () => {
          expect(result.composable.volume.value).toBe(0.5);
        });

        it('sets the the isMuted value', () => {
          expect(result.composable.isMuted.value).toBe(false);
        });

        it('calls the setLocalStorage function', () => {
          expect(setLocalStorageMock).toHaveBeenCalledWith(
            STATE_NAMES.playerState,
            expect.objectContaining({
              volume: 0.5,
            }),
          );
        });
      });

      describe('when volume is 0', () => {
        beforeAll(() => {
          result.composable.volume.value = 0;
          result.composable.toggleVolume(0);
        });

        it('calls the audio setVolume function', () => {
          expect(setVolumeMock).toHaveBeenCalledWith(0.1);
        });

        it('sets the the volume value', () => {
          expect(result.composable.volume.value).toBe(0.1);
        });

        it('sets the the isMuted value', () => {
          expect(result.composable.isMuted.value).toBe(false);
        });

        it('calls the setLocalStorage function', () => {
          expect(setLocalStorageMock).toHaveBeenCalledWith(
            STATE_NAMES.playerState,
            expect.objectContaining({
              volume: 0.1,
            }),
          );
        });
      });
    });
  });

  describe('when playTracks function is called', () => {
    beforeAll(() => {
      result.composable.playTracks(queueTracks);
    });

    afterAll(() => {
      vi.clearAllMocks();
      result.composable.queueList.value = [];
    });

    it('adds to the queueList value', () => {
      expect(result.composable.queueList.value).toEqual(queueTracks);
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

    it('calls the audio unload function', () => {
      expect(unloadMock).toHaveBeenCalled();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith('queue-streamUrlId0');
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });
  });

  describe('when playCurrentTrack function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = [...queueTracks];
      result.composable.playCurrentTrack(queueTracks[0]);
    });

    afterAll(() => {
      vi.clearAllMocks();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        STATE_NAMES.playerState,
        expect.objectContaining({
          queueList: queueTracks,
        }),
      );
    });

    describe('when mediaSession is in navigator', () => {
      describe('when track type is a track', () => {
        it('calls the MediaMetadata function', () => {
          expect(window.MediaMetadata).toHaveBeenCalledWith({
            album: (queueTracks[0] as Track).album,
            artist: expect.any(String),
            artwork: expect.any(Array),
            title: queueTracks[0].name,
          });
        });
      });

      describe('when track type is a radio station', () => {
        const radioStations = getFormattedQueueTracksMock(1, {
          type: MEDIA_TYPE.radioStation,
        });

        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.queueList.value = [...radioStations];
          result.composable.playCurrentTrack(radioStations[0]);
        });

        it('calls the MediaMetadata function', () => {
          expect(window.MediaMetadata).toHaveBeenCalledWith({
            artwork: expect.any(Array),
            title: radioStations[0].name,
          });
        });
      });

      describe('when track type is a podcast episode', () => {
        const podcastEpisodes = getFormattedQueueTracksMock(1, {
          podcastName: 'podcastName',
          type: MEDIA_TYPE.podcastEpisode,
        });

        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.queueList.value = podcastEpisodes;
          result.composable.playCurrentTrack(podcastEpisodes[0]);
        });

        it('calls the MediaMetadata function', () => {
          expect(window.MediaMetadata).toHaveBeenCalledWith({
            album: (podcastEpisodes[0] as PodcastEpisode).podcastName,
            artwork: expect.any(Array),
            title: podcastEpisodes[0].name,
          });
        });
      });
    });

    describe('when mediaSession is not in navigator', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'navigator', {
          value: {},
        });

        result.composable.playCurrentTrack(queueTrack);
      });

      afterAll(() => {
        Object.defineProperty(window.navigator, 'mediaSession', {
          configurable: true,
          value: {
            playbackState: '',
            setActionHandler: vi.fn(),
            setPositionState: setPositionStateMock,
          },
          writable: true,
        });
      });

      it('does not call the MediaMetadata function', () => {
        expect(window.MediaMetadata).not.toHaveBeenCalled();
      });
    });
  });

  describe('when togglePlay function is called', () => {
    beforeAll(() => {
      result.composable.togglePlay();
    });

    it('sets the the isPlaying value', () => {
      expect(result.composable.isPlaying.value).toBe(false);
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    describe('when mediaSession is in navigator', () => {
      it('sets the correct playbackState state', () => {
        expect(navigator.mediaSession.playbackState).toBe('paused');
      });
    });

    describe('when togglePlay function is called again', () => {
      beforeAll(() => {
        result.composable.togglePlay();
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      it('sets the the isPlaying value', () => {
        expect(result.composable.isPlaying.value).toBe(true);
      });

      describe('when mediaSession is in navigator', () => {
        it('sets the correct playbackState state', () => {
          expect(navigator.mediaSession.playbackState).toBe('playing');
        });
      });
    });

    describe('when play throws an error', () => {
      describe('when navigator.onLine is false', () => {
        beforeAll(() => {
          playMock.mockImplementationOnce(() => {
            throw new Error('new Error message.');
          });

          result.composable.togglePlay();
          result.composable.togglePlay();
        });

        it('does not remove the current track from queueList', () => {
          expect(result.composable.queueList.value.length).toBe(1);
        });
      });

      describe('when navigator.onLine is true', () => {
        beforeAll(() => {
          Object.defineProperty(window.navigator, 'onLine', {
            configurable: true,
            value: true,
            writable: true,
          });
        });

        describe('when error does not contain no supported source', () => {
          beforeAll(() => {
            playMock.mockImplementationOnce(() => {
              throw new Error('new Error message.');
            });

            result.composable.togglePlay();
            result.composable.togglePlay();
          });

          it('does not remove the current track from queueList', () => {
            expect(result.composable.queueList.value.length).toBe(1);
          });
        });

        describe('when error contains no supported source', () => {
          beforeAll(() => {
            playMock.mockImplementationOnce(() => {
              throw new Error('no supported source.');
            });

            result.composable.togglePlay();
            result.composable.togglePlay();
          });

          it('removes the current track from queueList', () => {
            expect(result.composable.queueList.value.length).toBe(0);
          });
        });
      });
    });
  });

  describe('when rewindTrack function is called', () => {
    describe(`when currentTime is greater than ${REWIND_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.duration.value = 120;
        result.composable.currentTime.value = REWIND_TRACK_TIME + 1;
        result.composable.rewindTrack();
      });

      it('calls the audio setCurrentTime function', () => {
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

      it('does not call the audio setCurrentTime function', () => {
        expect(setCurrentTimeMock).not.toHaveBeenCalled();
      });
    });

    describe(`when currentTime is equal to ${REWIND_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.currentTime.value = REWIND_TRACK_TIME;
        result.composable.rewindTrack();
      });

      it('does not call the audio setCurrentTime function', () => {
        expect(setCurrentTimeMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when fastForwardTrack function is called', () => {
    const duration = 120;

    describe(`when currentTime is less than the duration - ${FAST_FORWARD_TRACK_TIME}`, () => {
      beforeAll(() => {
        result.composable.duration.value = duration;
        result.composable.currentTime.value =
          duration - FAST_FORWARD_TRACK_TIME - 1;
        result.composable.fastForwardTrack();
      });

      it('calls the audio setCurrentTime function', () => {
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
  });

  describe('when playNextTrack function is called', () => {
    describe('when track is not the last track in queueList', () => {
      beforeAll(() => {
        result.composable.queueList.value = [...queueTracks];
        result.composable.playNextTrack();
      });

      it('calls the audio load function', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          STATE_NAMES.playerState,
          expect.objectContaining({
            currentQueueIndex: 0,
            queueList: queueTracks,
          }),
        );
      });
    });

    describe('when track is the last track in queueList', () => {
      beforeAll(() => {
        result.composable.playNextTrack();
        result.composable.playNextTrack();
        result.composable.playNextTrack();
        result.composable.playNextTrack();
        vi.clearAllMocks();
        result.composable.playNextTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });
  });

  describe('when playPreviousTrack function is called', () => {
    describe('when track is the first track in queueList', () => {
      beforeAll(() => {
        result.composable.playPreviousTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[4].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          STATE_NAMES.playerState,
          expect.objectContaining({
            currentQueueIndex: 4,
            queueList: queueTracks,
          }),
        );
      });
    });

    describe('when track is not first track in queueList', () => {
      beforeAll(() => {
        result.composable.playPreviousTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[3].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });
  });

  describe('when isCurrentTrack function is called', () => {
    describe('when current track id is the same as the id', () => {
      it('returns the correct value', () => {
        expect(result.composable.isCurrentTrack(queueTracks[3].id)).toBe(true);
      });
    });

    describe('when current track id is not the same as the id', () => {
      it('returns the correct value', () => {
        expect(result.composable.isCurrentTrack('no-id')).toBe(false);
      });
    });
  });

  describe('when updateQueueTrackFavourite function is called', () => {
    describe('when id is not in queueTrack', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        result.composable.updateQueueTrackFavourite('id-not-found', true);
      });

      it('does not update the queueList favourite value', () => {
        expect(result.composable.queueList.value).toEqual(
          result.composable.queueList.value,
        );
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when id is in queueTrack', () => {
      describe('when current track id is the same as the id', () => {
        it('updates the queueList favourite value', () => {
          expect(
            (result.composable.queueList.value[1] as Track).favourite,
          ).toBe(false);

          result.composable.updateQueueTrackFavourite(queueTracks[1].id, true);

          expect(
            (result.composable.queueList.value[1] as Track).favourite,
          ).toBe(true);
        });

        it('calls the setLocalStorage function', () => {
          expect(setLocalStorageMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when resetAudio function is called', () => {
    beforeAll(() => {
      result.composable.resetAudio();
    });

    it('calls the audio unload function', () => {
      expect(unloadMock).toHaveBeenCalled();
    });

    it('calls the deleteLocalStorage function', () => {
      expect(deleteLocalStorageMock).toHaveBeenCalled();
    });

    it('sets isBuffering to default value', () => {
      expect(result.composable.isBuffering.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.isBuffering,
      );
    });

    it('sets currentTime to default value', () => {
      expect(result.composable.currentTime.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.currentTime,
      );
    });

    it('sets bufferedDuration to default value', () => {
      expect(result.composable.bufferedDuration.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.bufferedDuration,
      );
    });

    it('sets duration to default value', () => {
      expect(result.composable.duration.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.duration,
      );
    });

    it('sets isPlaying to default value', () => {
      expect(result.composable.isPlaying.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.isPlaying,
      );
    });

    it('sets playbackRate to default value', () => {
      expect(result.composable.playbackRate.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.playbackRate,
      );
    });

    it('sets isMuted to default value', () => {
      expect(result.composable.isMuted.value).toBe(false);
    });

    it('sets volume to default value', () => {
      expect(result.composable.volume.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.volume,
      );
    });

    it('sets queueList to default value', () => {
      expect(result.composable.queueList.value).toEqual(
        AUDIO_PLAYER_DEFAULT_STATES.queueList,
      );
    });

    it('sets repeat to default value', () => {
      expect(result.composable.repeat.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.repeat,
      );
    });

    it('sets shuffle to default value', () => {
      expect(result.composable.shuffle.value).toBe(
        AUDIO_PLAYER_DEFAULT_STATES.shuffle,
      );
    });

    it('sets the correct hasNextTrack to default value', () => {
      expect(result.composable.hasNextTrack.value).toBe(false);
    });

    it('sets the correct hasPreviousTrack to default value', () => {
      expect(result.composable.hasPreviousTrack.value).toBe(false);
    });

    it('sets the the correct showMediaPlayer to default value', () => {
      expect(result.composable.showMediaPlayer.value).toBe(false);
    });

    it('sets the the correct currentTrack to default value', () => {
      expect(result.composable.currentTrack.value).toEqual({});
    });

    it('sets the the correct isTrack to default value', () => {
      expect(result.composable.isTrack.value).toBe(false);
    });

    it('sets the the correct isPodcastEpisode to default value', () => {
      expect(result.composable.isPodcastEpisode.value).toBe(false);
    });

    it('sets the the correct isRadioStation to default value', () => {
      expect(result.composable.isRadioStation.value).toBe(false);
    });
  });

  describe('when track is not first track in queueList', () => {
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

      describe('when mediaSession is in navigator', () => {
        it('calls the navigator mediaSession setPositionState function', () => {
          expect(setPositionStateMock).toHaveBeenCalledWith(
            expect.objectContaining({
              position: 20,
            }),
          );
        });
      });
    });

    describe('when onLoadedMetadata event is called', () => {
      describe.each([
        ['120', 120],
        [120, 120],
        [-120, -120],
        [Infinity, 0],
        [-Infinity, 0],
      ])('when duration is %s', (duration, setValue) => {
        beforeAll(() => {
          onLoadedMetadataCb(duration);
        });

        it('sets the correct duration value', () => {
          expect(result.composable.duration.value).toBe(setValue);
        });

        describe('when mediaSession is in navigator', () => {
          it('calls the navigator mediaSession setPositionState function', () => {
            expect(setPositionStateMock).toHaveBeenCalledWith(
              expect.objectContaining({
                duration: setValue,
              }),
            );
          });
        });
      });
    });

    describe('when onEnded event is called', () => {
      beforeAll(() => {
        result.composable.queueList.value = queueTracks;
        onEndedCb();
      });

      describe('when track type is not a podcast episode', () => {
        it('does not call the deleteBookmark function', () => {
          expect(deleteBookmarkMock).not.toHaveBeenCalled();
        });
      });

      describe('when track type is a podcast episode', () => {
        beforeAll(() => {
          result.composable.queueList.value = getFormattedQueueTracksMock(5, {
            type: MEDIA_TYPE.podcastEpisode,
          });

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

        it('calls the audio load function with the first track', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
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

        it('calls the audio load function with next track', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrlId);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        describe('when track is the last track in queueList', () => {
          beforeAll(() => {
            onEndedCb();
            onEndedCb();
            vi.clearAllMocks();
            onEndedCb();
          });

          it('calls the audio load function with the first track', () => {
            expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
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
          result.composable.repeat.value = Number.POSITIVE_INFINITY;
          onEndedCb();
        });

        it('calls the audio load function with next track', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        describe('when track is the last track in queueList', () => {
          beforeAll(() => {
            onEndedCb();
            onEndedCb();
            onEndedCb();
            vi.clearAllMocks();
            onEndedCb();
          });

          it('calls the audio load function with the first track', () => {
            expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrlId);
          });

          it('calls the audio play function', () => {
            expect(playMock).toHaveBeenCalled();
          });

          it('does not call the audio pause function', () => {
            expect(pauseMock).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
