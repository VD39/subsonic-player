import { getFormattedQueueTracksMock } from '@/test/helpers';
import { withSetup } from '@/test/withSetup';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAudioPlayer } from './index';

const queueTracks = getFormattedQueueTracksMock(3);
const queueTracksMore = getFormattedQueueTracksMock(15);
const queueTrack = queueTracks[0];

Object.defineProperty(window.navigator, 'mediaSession', {
  configurable: true,
  value: {
    playbackState: '',
    setActionHandler: vi.fn(),
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
const stopMock = vi.fn();
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
    stop: stopMock,
    unload: unloadMock,
  })),
);

const resetQueueStateMock = vi.fn();

mockNuxtImport('useQueue', () => () => ({
  resetQueueState: resetQueueStateMock,
}));

describe('useAudioPlayer', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>;

  beforeEach(() => {
    result = withSetup(useAudioPlayer);
  });

  it('sets the default trackIsBuffering value', () => {
    expect(result.composable.trackIsBuffering.value).toBe(false);
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

  it('sets the the correct isPodcastEpisode value', () => {
    expect(result.composable.isPodcastEpisode.value).toBe(false);
  });

  it('sets the the correct isRadioStation value', () => {
    expect(result.composable.isRadioStation.value).toBe(false);
  });

  describe.each([
    [MEDIA_TYPE.track, true, false, false],
    [MEDIA_TYPE.podcastEpisode, false, true, false],
    [MEDIA_TYPE.radioStation, false, false, true],
  ])(
    'when track type is %s',
    (type, isTrack, isPodcastEpisode, isRadioStation) => {
      beforeAll(() => {
        result.composable.playTracks([
          {
            ...queueTrack,
            type,
          },
        ]);
      });

      afterAll(() => {
        vi.clearAllMocks();
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
          expect(loadMock).toHaveBeenCalledWith(queueTracks[2].streamUrlId);
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

  describe('when playTrackFromQueueList function is called', () => {
    beforeAll(() => {
      result.composable.queueList.value = queueTracks;
      result.composable.playTrackFromQueueList(2);
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith(queueTracks[2].streamUrlId);
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
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

    it('calls the resetQueueState function', () => {
      expect(resetQueueStateMock).toHaveBeenCalled();
    });
  });

  describe('when setVolume function is called', () => {
    beforeAll(() => {
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
      result.composable.setCurrentTime(23);
    });

    it('calls the audio setCurrentTime function', () => {
      expect(setCurrentTimeMock).toHaveBeenCalledWith(23);
    });
  });

  describe('when setPlaybackRate function is called', () => {
    beforeAll(() => {
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
      result.composable.playTracks(queueTracks);
    });

    afterAll(() => {
      vi.clearAllMocks();
      result.composable.queueList.value = [];
    });

    it('adds to the queueList value', () => {
      expect(result.composable.queueList.value).toEqual(queueTracks);
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
      result.composable.queueList.value = queueTracks;
      result.composable.playCurrentTrack(queueTrack);
    });

    afterAll(() => {
      vi.clearAllMocks();
    });

    it('calls the audio load function', () => {
      expect(loadMock).toHaveBeenCalledWith(queueTrack.streamUrlId);
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });

    describe('when mediaSession is in navigator', () => {
      describe('when track type is a track', () => {
        it('calls the MediaMetadata function', () => {
          expect(window.MediaMetadata).toHaveBeenCalledWith({
            album: 'album',
            artist: 'name, name1',
            artwork: expect.any(Array),
            title: 'queue-track-0-name',
          });
        });
      });

      describe('when track type is a radio station', () => {
        beforeAll(() => {
          const queue = getFormattedQueueTracksMock(1, {
            type: MEDIA_TYPE.radioStation,
          });

          vi.clearAllMocks();
          result.composable.queueList.value = queue;
          result.composable.playCurrentTrack(queue[0]);
        });

        it('calls the MediaMetadata function', () => {
          expect(window.MediaMetadata).toHaveBeenCalledWith({
            artwork: expect.any(Array),
            title: 'queue-radioStation-0-name',
          });
        });
      });

      describe('when track type is a podcast episode', () => {
        beforeAll(() => {
          const queue = getFormattedQueueTracksMock(1, {
            podcastName: 'podcastName',
            type: MEDIA_TYPE.podcastEpisode,
          });

          vi.clearAllMocks();
          result.composable.queueList.value = queue;
          result.composable.playCurrentTrack(queue[0]);
        });

        it('calls the MediaMetadata function', () => {
          expect(window.MediaMetadata).toHaveBeenCalledWith({
            album: 'podcastName',
            artwork: expect.any(Array),
            title: 'queue-podcastEpisode-0-name',
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

    it('sets the the trackIsPlaying value', () => {
      expect(result.composable.trackIsPlaying.value).toBe(false);
    });

    describe('when track is not a radio station', () => {
      it('calls the audio pause function', () => {
        expect(pauseMock).toHaveBeenCalled();
      });

      it('does not call the audio stop function', () => {
        expect(stopMock).not.toHaveBeenCalled();
      });

      describe('when mediaSession is in navigator', () => {
        it('sets the correct playbackState state', () => {
          expect(navigator.mediaSession.playbackState).toBe('paused');
        });
      });
    });

    describe('when track is radio station', () => {
      beforeAll(async () => {
        vi.clearAllMocks();
        await result.composable.playTracks([
          {
            ...queueTrack,
            type: MEDIA_TYPE.radioStation,
          },
        ]);

        await result.composable.togglePlay();
      });

      it('calls the audio stop function', () => {
        expect(stopMock).toHaveBeenCalled();
      });

      it('does not call the audio pause function', () => {
        expect(pauseMock).not.toHaveBeenCalled();
      });
    });

    describe('when togglePlay function is called again', () => {
      beforeAll(() => {
        result.composable.togglePlay();
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });

      it('sets the the trackIsPlaying value', () => {
        expect(result.composable.trackIsPlaying.value).toBe(true);
      });

      describe('when mediaSession is in navigator', () => {
        it('sets the correct playbackState state', () => {
          expect(navigator.mediaSession.playbackState).toBe('playing');
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
        result.composable.queueList.value = queueTracks;
        result.composable.playNextTrack();
      });

      it('calls the audio load function', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });

    describe('when track is the last track in queueList', () => {
      beforeAll(() => {
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
        expect(loadMock).toHaveBeenCalledWith(queueTracks[2].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });

    describe('when track is not first track in queueList', () => {
      beforeAll(() => {
        result.composable.playPreviousTrack();
      });

      it('calls the audio load function with the first track', () => {
        expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrlId);
      });

      it('calls the audio play function', () => {
        expect(playMock).toHaveBeenCalled();
      });
    });
  });

  describe('when isCurrentTrack function is called', () => {
    describe('when current track id is the same as the id', () => {
      it('returns the correct value', () => {
        expect(result.composable.isCurrentTrack(queueTracks[1].id)).toBe(true);
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

      it('sets the correct trackIsBuffering value', () => {
        expect(result.composable.trackIsBuffering.value).toBe(true);
      });
    });

    describe('when onCanPlay event is called', () => {
      beforeAll(() => {
        onCanPlayCb();
      });

      it('sets the correct trackIsBuffering value', () => {
        expect(result.composable.trackIsBuffering.value).toBe(false);
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
          expect(loadMock).toHaveBeenCalledWith(queueTracks[1].streamUrlId);
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
