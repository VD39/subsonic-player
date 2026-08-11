import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getFormattedQueueTracksMock } from '@/test/helpers';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const setActionHandlerMock = vi.fn();
const setPositionStateMock = vi.fn();

Object.defineProperty(globalThis.navigator, 'mediaSession', {
  configurable: true,
  value: {
    setActionHandler: setActionHandlerMock,
    setPositionState: setPositionStateMock,
  },
  writable: true,
});

globalThis.MediaMetadata = vi.fn().mockImplementation(function (data) {
  return data;
});

const currentTimeMock = ref(20);
const currentTrackMock = ref(getFormattedQueueTracksMock()[0]);
const hasCurrentTrackMock = ref(true);
const hasNextTrackMock = ref(false);
const hasPreviousTrackMock = ref(false);
const isPodcastEpisodeMock = ref(true);
const isRadioStationMock = ref(false);
const playbackRateMock = ref(0);

const mediaSessionActionsMock: MediaSessionActions = {
  canPlayNext: computed(() => hasNextTrackMock.value),
  canPlayPrevious: computed(() => hasPreviousTrackMock.value),
  currentTime: computed(() => currentTimeMock.value),
  currentTrack: computed(() => currentTrackMock.value),
  hasCurrentTrack: computed(() => hasCurrentTrackMock.value),
  isPodcastEpisode: computed(() => isPodcastEpisodeMock.value),
  isRadioStation: computed(() => isRadioStationMock.value),
  [MEDIA_SESSION_ACTION_DETAILS.nextTrack]: vi.fn(),
  [MEDIA_SESSION_ACTION_DETAILS.pause]: vi.fn(),
  [MEDIA_SESSION_ACTION_DETAILS.play]: vi.fn(),
  [MEDIA_SESSION_ACTION_DETAILS.previousTrack]: vi.fn(),
  [MEDIA_SESSION_ACTION_DETAILS.seekBackward]: vi.fn(),
  [MEDIA_SESSION_ACTION_DETAILS.seekForward]: vi.fn(),
  [MEDIA_SESSION_ACTION_DETAILS.seekTo]: vi.fn(),
  playbackRate: computed(() => playbackRateMock.value),
};

describe('useMediaSession', () => {
  let composable: ReturnType<typeof useMediaSession>;

  beforeEach(() => {
    composable = useMediaSession(mediaSessionActionsMock);
  });

  afterEach(() => {
    (globalThis.navigator as unknown) = {};

    Object.defineProperty(globalThis.navigator, 'mediaSession', {
      configurable: true,
      value: {
        setActionHandler: setActionHandlerMock,
        setPositionState: setPositionStateMock,
      },
      writable: true,
    });
  });

  describe('when the setMediaSessionMetadata function is called', () => {
    describe('when mediaSession is undefined', () => {
      beforeEach(() => {
        (globalThis.navigator as unknown) = undefined;

        composable = useMediaSession(mediaSessionActionsMock);

        composable.setMediaSessionMetadata();
      });

      it('does not call the MediaMetadata function', () => {
        expect(MediaMetadata).not.toHaveBeenCalled();
      });
    });

    describe('when there is no current track', () => {
      beforeEach(() => {
        hasCurrentTrackMock.value = false;
        composable.setMediaSessionMetadata();
      });

      it('does not call the MediaMetadata function', () => {
        expect(MediaMetadata).not.toHaveBeenCalled();
      });
    });

    describe('when mediaSession and current track are available', () => {
      beforeEach(() => {
        hasCurrentTrackMock.value = true;
        composable.setMediaSessionMetadata();
      });

      it('sets the metadata title', () => {
        expect((navigator.mediaSession.metadata as MediaMetadata).title).toBe(
          'queue-track-0-name',
        );
      });

      it('sets the metadata album', () => {
        expect((navigator.mediaSession.metadata as MediaMetadata).album).toBe(
          'album',
        );
      });

      it('sets the metadata artist', () => {
        expect((navigator.mediaSession.metadata as MediaMetadata).artist).toBe(
          'name & name1',
        );
      });

      it('sets the metadata artwork', () => {
        expect(
          (navigator.mediaSession.metadata as MediaMetadata).artwork,
        ).toEqual([
          {
            sizes: '96x96',
            src: 'image',
            type: 'image/jpeg',
          },
          {
            sizes: '128x128',
            src: 'image',
            type: 'image/jpeg',
          },
          {
            sizes: '192x192',
            src: 'image',
            type: 'image/jpeg',
          },
          {
            sizes: '256x256',
            src: 'image',
            type: 'image/jpeg',
          },
          {
            sizes: '384x384',
            src: 'image',
            type: 'image/jpeg',
          },
          {
            sizes: '512x512',
            src: 'image',
            type: 'image/jpeg',
          },
        ]);
      });
    });
  });

  describe('when the setMediaSessionPlaybackState function is called', () => {
    describe('when mediaSession is undefined', () => {
      beforeEach(() => {
        (globalThis.navigator as unknown) = undefined;
      });

      it('does not set the navigator.mediaSession.playbackState', () => {
        expect(() =>
          useMediaSession(mediaSessionActionsMock).setMediaSessionPlaybackState(
            'playing',
          ),
        ).not.toThrow();
      });
    });

    describe('when mediaSession is available', () => {
      beforeEach(() => {
        composable.setMediaSessionPlaybackState('none');
      });

      it('sets the navigator.mediaSession.playbackState', () => {
        expect(navigator.mediaSession.playbackState).toBe('none');
      });
    });
  });

  describe('when the setMediaSessionPositionState function is called', () => {
    describe('when mediaSession is undefined', () => {
      beforeEach(() => {
        (globalThis.navigator as unknown) = undefined;
      });

      it('does not call the setPositionState function', () => {
        expect(setPositionStateMock).not.toHaveBeenCalled();
      });
    });

    describe('when mediaSession is available', () => {
      describe('when the hasCurrentTrack value is false', () => {
        beforeEach(() => {
          hasCurrentTrackMock.value = false;
          composable.setMediaSessionPositionState();
        });

        it('does not call the setPositionState function', () => {
          expect(setPositionStateMock).not.toHaveBeenCalled();
        });
      });

      describe('when the hasCurrentTrack value is true', () => {
        describe('when the isRadioStation value is true', () => {
          beforeEach(() => {
            hasCurrentTrackMock.value = true;
            isRadioStationMock.value = true;
            composable.setMediaSessionPositionState();
          });

          it('does not call the setPositionState function', () => {
            expect(setPositionStateMock).not.toHaveBeenCalled();
          });
        });

        describe('when the isRadioStation value is false', () => {
          beforeEach(() => {
            hasCurrentTrackMock.value = true;
            isRadioStationMock.value = false;
            composable.setMediaSessionPositionState();
          });

          it('calls the setPositionState function with the current track position and duration', () => {
            expect(setPositionStateMock).toHaveBeenCalledWith({
              duration: 120,
              playbackRate: 0.5,
              position: 20,
            });
          });
        });
      });
    });
  });

  describe('when the setupMediaSessionHandlers function is called', () => {
    describe('when mediaSession is undefined', () => {
      beforeEach(() => {
        (globalThis.navigator as unknown) = undefined;

        composable = useMediaSession(mediaSessionActionsMock);

        composable.setupMediaSessionHandlers();
      });

      it('does not call the setActionHandler function', () => {
        expect(setActionHandlerMock).not.toHaveBeenCalled();
      });
    });

    describe('when mediaSession is available', () => {
      beforeEach(() => {
        composable.setupMediaSessionHandlers();
      });

      it('sets the play action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.play,
          expect.any(Function),
        );
      });

      it('sets the pause action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.pause,
          expect.any(Function),
        );
      });

      it('sets the seekTo action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.seekTo,
          expect.any(Function),
        );
      });
    });

    describe('when the canPlayNext value is true', () => {
      beforeEach(() => {
        hasNextTrackMock.value = true;
        composable.setupMediaSessionHandlers();
      });

      it('sets the nextTrack action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.nextTrack,
          expect.any(Function),
        );
      });
    });

    describe('when the canPlayNext value is false', () => {
      beforeEach(() => {
        hasNextTrackMock.value = false;
        composable.setupMediaSessionHandlers();
      });

      it('sets the nextTrack action handler to null', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.nextTrack,
          null,
        );
      });
    });

    describe('when the canPlayPrevious value is true', () => {
      beforeEach(() => {
        hasPreviousTrackMock.value = true;
        composable.setupMediaSessionHandlers();
      });

      it('sets the previousTrack action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.previousTrack,
          expect.any(Function),
        );
      });
    });

    describe('when the canPlayPrevious value is false', () => {
      beforeEach(() => {
        hasPreviousTrackMock.value = false;
        composable.setupMediaSessionHandlers();
      });

      it('sets the previousTrack action handler to null', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.previousTrack,
          null,
        );
      });
    });

    describe('when the isPodcastEpisode value is true', () => {
      beforeEach(() => {
        isPodcastEpisodeMock.value = true;
        composable.setupMediaSessionHandlers();
      });

      it('sets the seekBackward action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.seekBackward,
          expect.any(Function),
        );
      });

      it('sets the seekForward action handler', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.seekForward,
          expect.any(Function),
        );
      });
    });

    describe('when the isPodcastEpisode value is false', () => {
      beforeEach(() => {
        isPodcastEpisodeMock.value = false;
        composable.setupMediaSessionHandlers();
      });

      it('sets the seekBackward action handler to null', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.seekBackward,
          null,
        );
      });

      it('sets the seekForward action handler to null', () => {
        expect(setActionHandlerMock).toHaveBeenCalledWith(
          MEDIA_SESSION_ACTION_DETAILS.seekForward,
          null,
        );
      });
    });
  });
});
