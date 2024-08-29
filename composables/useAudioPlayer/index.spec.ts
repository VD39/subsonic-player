import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { withSetup } from '@/test/withSetup';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayer } from './index';

const queueTracks = getFormattedQueueTracksMock(3);
const queueTracksMore = getFormattedQueueTracksMock(15);
const queueTrack = queueTracks[0];

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

describe('useAudioPlayer', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>;

  beforeAll(() => {
    result = withSetup(useAudioPlayer);
  });

  it('sets the default trackCanPlay value', () => {
    expect(result.composable.trackCanPlay.value).toBe(false);
  });

  it('sets the default currentTime value', () => {
    expect(result.composable.currentTime.value).toBe(0);
  });

  it('sets the default bufferedDuration value', () => {
    expect(result.composable.bufferedDuration.value).toBe(0);
  });

  it('sets the default duration value', () => {
    expect(result.composable.duration.value).toBe(0);
  });

  it('sets the default trackIsPlaying value', () => {
    expect(result.composable.trackIsPlaying.value).toBe(false);
  });

  it('sets the default playBackRate value', () => {
    expect(result.composable.playBackRate.value).toBe(1);
  });

  it('sets the default isMuted value', () => {
    expect(result.composable.isMuted.value).toBe(false);
  });

  it('sets the default volume value', () => {
    expect(result.composable.volume.value).toBe(1);
  });

  it('sets the default queueList value', () => {
    expect(result.composable.queueList.value).toEqual([]);
  });

  it('sets the default repeat value', () => {
    expect(result.composable.repeat.value).toBe(-1);
  });

  it('sets the default shuffle value', () => {
    expect(result.composable.shuffle.value).toBe(false);
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

  it('sets the the correct isPodcast value', () => {
    expect(result.composable.isPodcast.value).toBe(false);
  });

  it('sets the the correct isRadioStation value', () => {
    expect(result.composable.isRadioStation.value).toBe(false);
  });

  describe.each([
    ['track', true, false, false],
    ['podcastEpisode', false, true, false],
    ['radioStation', false, false, true],
  ])('when track type is %s', (type, isTrack, isPodcast, isRadioStation) => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.playTracks([
        {
          ...queueTrack,
          type: type as MediaType,
        },
      ]);
    });

    afterAll(() => {
      result.composable.queueList.value = [];
    });

    it('sets the the correct isTrack value', () => {
      expect(result.composable.isTrack.value).toBe(isTrack);
    });

    it('sets the the correct isPodcast value', () => {
      expect(result.composable.isPodcast.value).toBe(isPodcast);
    });

    it('sets the the correct isRadioStation value', () => {
      expect(result.composable.isRadioStation.value).toBe(isRadioStation);
    });
  });

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
  });

  describe('when removeTrackFromQueueList function is called', () => {
    describe('when id is not found in queueList', () => {
      beforeAll(() => {
        result.composable.removeTrackFromQueueList('idNotFound');
      });

      it('does not change the queueList', () => {
        expect(result.composable.queueList.value).toEqual([
          queueTrack,
          queueTracks[1],
          queueTracks[2],
        ]);
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
            queueTrack,
            queueTracks[2],
          ]);
        });

        it('does not call the audio unload function', () => {
          expect(unloadMock).not.toHaveBeenCalled();
        });

        it('does not call the audio load function', () => {
          expect(loadMock).not.toHaveBeenCalled();
        });
      });

      describe('when id is the same as the currentTrack', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTrack.id);
        });

        it('removes the item from the queueList', () => {
          expect(result.composable.queueList.value).toEqual([queueTracks[2]]);
        });

        it('calls the audio unload function', () => {
          expect(unloadMock).toHaveBeenCalled();
        });

        it('calls the audio load function', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[2].streamUrl);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });
      });

      describe('when queueList contains only a single value', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          result.composable.removeTrackFromQueueList(queueTracks[2].id);
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
      });
    });
  });

  describe('when clearQueueList function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = queueTracks;
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
  });

  describe('when setVolume function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.setVolume(0.23);
    });

    it('calls the audio setVolume function', () => {
      expect(setVolumeMock).toHaveBeenCalledWith(0.23);
    });

    it('sets the the playBackRate value', () => {
      expect(result.composable.volume.value).toBe(0.23);
    });
  });

  describe('when setCurrentTime function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.setCurrentTime(23);
    });

    it('calls the audio setCurrentTime function', () => {
      expect(setCurrentTimeMock).toHaveBeenCalledWith(23);
    });
  });

  describe('when setPlaybackRate function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.setPlaybackRate(0.5);
    });

    it('calls the audio changePlaybackRate function', () => {
      expect(changePlaybackRateMock).toHaveBeenCalledWith(0.5);
    });

    it('sets the the playBackRate value', () => {
      expect(result.composable.playBackRate.value).toBe(0.5);
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
    },
  );

  describe('when toggleShuffle function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = queueTracksMore;
      result.composable.toggleShuffle();
    });

    afterAll(() => {
      result.composable.queueList.value = [];
    });

    it('sets the the shuffle value', () => {
      expect(result.composable.shuffle.value).toBe(true);
    });

    it('shuffles the queueList value', () => {
      expect(result.composable.queueList.value).not.toEqual(queueTracksMore);
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
      result.composable.shuffleTracks(queueTracksMore);
    });

    afterAll(() => {
      result.composable.queueList.value = [];
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

    describe('when toggleVolume function is called again', () => {
      describe('when volume is greater than 0', () => {
        beforeAll(() => {
          vi.clearAllMocks();
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
      });

      describe('when volume is 0', () => {
        beforeAll(() => {
          vi.clearAllMocks();
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
      });
    });
  });

  describe('when playTracks function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.playTracks(queueTracks);
    });

    afterAll(() => {
      result.composable.queueList.value = [];
    });

    it('adds to the queueList value', () => {
      expect(result.composable.queueList.value).toEqual(queueTracks);
    });

    it('calls the audio unload function', () => {
      expect(unloadMock).toHaveBeenCalled();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith('queue-streamUrl0');
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });
  });

  describe('when playCurrentTrack function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.playCurrentTrack(queueTrack);
    });

    afterAll(() => {
      result.composable.queueList.value = [];
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith(queueTrack.streamUrl);
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });
  });

  describe('when togglePlay function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      result.composable.togglePlay();
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('sets the the trackIsPlaying value', () => {
      expect(result.composable.trackIsPlaying.value).toBe(false);
    });

    describe('when togglePlay function is called again', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.togglePlay();
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      it('sets the the trackIsPlaying value', () => {
        expect(result.composable.trackIsPlaying.value).toBe(true);
      });
    });
  });

  describe('when rewindTrack function is called', () => {
    describe(`when currentTime is greater than ${REWIND_TRACK_TIME}`, () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.duration.value = 120;
        result.composable.currentTime.value = REWIND_TRACK_TIME + 1;
        result.composable.rewindTrack();
      });

      it('calls the audio setCurrentTime function', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(1);
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
        vi.clearAllMocks();
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
        vi.clearAllMocks();
        result.composable.duration.value = duration;
        result.composable.currentTime.value =
          duration - FAST_FORWARD_TRACK_TIME - 1;
        result.composable.fastForwardTrack();
      });

      it('calls the audio setCurrentTime function', () => {
        expect(setCurrentTimeMock).toHaveBeenCalledWith(119);
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
        vi.clearAllMocks();
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
        vi.clearAllMocks();
        result.composable.queueList.value = queueTracks;
        result.composable.playNextTrack();
      });

      it('calls the audio load function', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrl);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });

    describe('when track is the last track in queueList', () => {
      beforeAll(() => {
        result.composable.playNextTrack();
        result.composable.playNextTrack();
        vi.clearAllMocks();
        result.composable.playNextTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrl);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });
  });

  describe('when playPreviousTrack function is called', () => {
    describe('when track is the first track in queueList', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.playPreviousTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[2].streamUrl);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });

    describe('when track is not first track in queueList', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        result.composable.playPreviousTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrl);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });
  });

  describe('when isCurrentTrack function is called', () => {
    describe('when current track id is the same as the id', () => {
      it('returns the correct value', () => {
        expect(result.composable.isCurrentTrack('queue-track-1')).toBe(true);
      });
    });

    describe('when current track id is not the same as the id', () => {
      it('returns the correct value', () => {
        expect(result.composable.isCurrentTrack('no-id')).toBe(false);
      });
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

      it('sets the correct trackCanPlay value', () => {
        expect(result.composable.trackCanPlay.value).toBe(false);
      });
    });

    describe('when onCanPlay event is called', () => {
      beforeAll(() => {
        onCanPlayCb();
      });

      it('sets the correct trackCanPlay value', () => {
        expect(result.composable.trackCanPlay.value).toBe(true);
      });
    });

    describe('when onTimeupdate event is called', () => {
      beforeAll(() => {
        onTimeupdateCb(20);
      });

      it('sets the correct currentTime value', () => {
        expect(result.composable.currentTime.value).toBe(20);
      });
    });

    describe('when onLoadedMetadata event is called', () => {
      beforeAll(() => {
        onLoadedMetadataCb(120);
      });

      it('sets the correct duration value', () => {
        expect(result.composable.duration.value).toBe(120);
      });
    });

    describe('when onEnded event is called', () => {
      beforeAll(() => {
        result.composable.playTracks(queueTracks);
      });

      describe('when repeat value is 1', () => {
        beforeAll(() => {
          result.composable.repeat.value = 1;
          onEndedCb();
        });

        it('calls the audio load function with the first track', () => {
          expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrl);
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
          expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrl);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        describe('when track is the last track in queueList', () => {
          beforeAll(() => {
            onEndedCb();
            vi.clearAllMocks();
            onEndedCb();
          });

          it('calls the audio load function with the first track', () => {
            expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrl);
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
          expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrl);
        });

        it('calls the audio play function', () => {
          expect(playMock).toHaveBeenCalled();
        });

        describe('when track is the last track in queueList', () => {
          beforeAll(() => {
            onEndedCb();
            vi.clearAllMocks();
            onEndedCb();
          });

          it('calls the audio load function with the first track', () => {
            expect(loadMock).toHaveBeenCalledWith(queueTracks[0].streamUrl);
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
