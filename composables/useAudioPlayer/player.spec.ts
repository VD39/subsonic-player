import { audioElementMock } from '@/test/audioElementMock';

import { AudioPlayer } from './player';

const {
  audioContextCloseMock,
  audioContextMock,
  audioContextResumeMock,
  audioEvents,
  audioLoadMock,
  audioMock,
  createGainMock,
  createMediaElementSourceMock,
  crossfadeGainNodeMock,
  pauseMock,
  playMock,
  removeAttributeMock,
  removeEventListenerMock,
  replayGainNodeMock,
  sourceNodeMock,
  volumeNodeMock,
} = audioElementMock();
const {
  addEventListenerMock: newAddEventListenerMock,
  audioMock: newAudioMock,
} = audioElementMock();

describe('AudioPlayer', () => {
  let player: AudioPlayer;

  beforeAll(() => {
    player = new AudioPlayer();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('when the changePlaybackRate function is called', () => {
    beforeAll(() => {
      player.changePlaybackRate(1.5);
    });

    it('sets the correct playbackRate value', () => {
      expect(audioMock.playbackRate).toBe(1.5);
    });
  });

  describe('when the unload function is called', () => {
    beforeAll(() => {
      player.unload();
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('removes the audio src attribute', () => {
      expect(removeAttributeMock).toHaveBeenCalledWith('src');
    });

    it('calls the audio load function', () => {
      expect(audioLoadMock).toHaveBeenCalled();
    });
  });

  describe('when setVolume is called before the audio context exists', () => {
    beforeAll(() => {
      player.setVolume(0.5);
    });

    it('does not set the volume node gain value', () => {
      expect(volumeNodeMock.gain.value).toBe(1);
    });
  });

  describe('when applyReplayGain is called before the audio context exists', () => {
    beforeAll(() => {
      player.applyReplayGain('track', -6);
    });

    it('does not set the replayGain node gain value', () => {
      expect(replayGainNodeMock.gain.value).toBe(1);
    });
  });

  describe('when mute is called before the audio context exists', () => {
    beforeAll(() => {
      player.mute();
    });

    it('does not set the crossfadeGain node gain value', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(1);
    });
  });

  describe('when resetCrossfadeGain is called before the audio context exists', () => {
    beforeAll(() => {
      player.resetCrossfadeGain();
    });

    it('does not set the crossfadeGain node gain value', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(1);
    });
  });

  describe('when the load function is called', () => {
    beforeAll(() => {
      player.load('stream-url');
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('removes the audio src attribute', () => {
      expect(removeAttributeMock).toHaveBeenCalledWith('src');
    });

    it('calls the audio load function', () => {
      expect(audioLoadMock).toHaveBeenCalled();
    });

    it('sets the correct volume gain value', () => {
      expect(volumeNodeMock.gain.value).toBe(0.5);
    });

    it('sets the correct replayGain node gain value', () => {
      expect(replayGainNodeMock.gain.value).toBe(Math.pow(10, -6 / 20));
    });

    it('sets the crossfadeGain node gain to 1', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(1);
    });

    it('connects the replayGain node to the crossfadeGain node', () => {
      expect(replayGainNodeMock.connect).toHaveBeenCalledWith(
        crossfadeGainNodeMock,
      );
    });

    it('connects the crossfadeGain node to the volume node', () => {
      expect(crossfadeGainNodeMock.connect).toHaveBeenCalledWith(
        volumeNodeMock,
      );
    });

    it('connects the volume node to the destination', () => {
      expect(volumeNodeMock.connect).toHaveBeenCalledWith(
        audioContextMock.destination,
      );
    });

    it('calls the createMediaElementSource function with the correct parameters', () => {
      expect(createMediaElementSourceMock).toHaveBeenCalledWith(audioMock);
    });
  });

  describe('when the pause function is called', () => {
    beforeAll(() => {
      player.pause();
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });
  });

  describe('when the play function is called', () => {
    beforeAll(async () => {
      await player.play();
    });

    it('calls the resume function', () => {
      expect(audioContextResumeMock).toHaveBeenCalled();
    });

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });
  });

  describe('when the setCurrentTime function is called', () => {
    beforeAll(() => {
      player.setCurrentTime(42);
    });

    it('sets the correct currentTime value', () => {
      expect(audioMock.currentTime).toBe(42);
    });
  });

  describe('when the setVolume function is called', () => {
    describe('when value is greater than 1', () => {
      beforeAll(() => {
        player.setVolume(2);
      });

      it('sets the correct volume value', () => {
        expect(volumeNodeMock.gain.value).toBe(1);
      });
    });

    describe('when value is less than 0', () => {
      beforeAll(() => {
        player.setVolume(-1);
      });

      it('sets the correct volume value', () => {
        expect(volumeNodeMock.gain.value).toBe(0);
      });
    });

    describe('when value is in between 0 and 1', () => {
      beforeAll(() => {
        player.setVolume(0.75);
      });

      it('sets the correct volume value', () => {
        expect(volumeNodeMock.gain.value).toBe(0.75);
      });
    });
  });

  describe('when the getCrossfadeGainNode function is called', () => {
    it('returns the correct response', () => {
      expect(player.getCrossfadeGainNode()).toBe(crossfadeGainNodeMock);
    });
  });

  describe('when the mute function is called', () => {
    beforeAll(() => {
      crossfadeGainNodeMock.gain.value = 1;
      player.mute();
    });

    it('sets the correct crossfadeGain node gain value', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(0);
    });
  });

  describe('when the resetCrossfadeGain function is called', () => {
    beforeAll(() => {
      crossfadeGainNodeMock.gain.value = 0;
      player.resetCrossfadeGain();
    });

    it('sets the correct crossfadeGain node gain value', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(1);
    });
  });

  describe('when the onCanPlay function is called', () => {
    const onCanPlayCallbackMock = vi.fn();

    beforeAll(() => {
      player.onCanPlay(onCanPlayCallbackMock);
    });

    describe('when the canplay event is fired', () => {
      beforeAll(() => {
        audioEvents.canplay();
      });

      it('calls the onCanPlay callback', () => {
        expect(onCanPlayCallbackMock).toHaveBeenCalled();
      });
    });

    describe('when the canplaythrough event is fired', () => {
      beforeAll(() => {
        audioEvents.canplaythrough();
      });

      it('calls the onCanPlay callback', () => {
        expect(onCanPlayCallbackMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the onPause function is called', () => {
    const onPauseCallbackMock = vi.fn();

    beforeAll(() => {
      player.onPause(onPauseCallbackMock);
      audioEvents.pause();
    });

    it('calls the onPause callback', () => {
      expect(onPauseCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onPlay function is called', () => {
    const onPlayCallbackMock = vi.fn();

    beforeAll(() => {
      player.onPlay(onPlayCallbackMock);
      audioEvents.play();
    });

    it('calls the onPlay callback', () => {
      expect(onPlayCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onEnded function is called', () => {
    const onEndedCallbackMock = vi.fn();

    beforeAll(() => {
      player.onEnded(onEndedCallbackMock);
      audioEvents.ended();
    });

    it('calls the onEnded callback', () => {
      expect(onEndedCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onLoadedMetadata function is called', () => {
    const onLoadedMetadataCallbackMock = vi.fn();

    beforeAll(() => {
      audioMock.duration = 180;
      player.onLoadedMetadata(onLoadedMetadataCallbackMock);
      audioEvents.loadedmetadata();
    });

    it('calls the onLoadedMetadata callback with the correct parameters', () => {
      expect(onLoadedMetadataCallbackMock).toHaveBeenCalledWith(180);
    });
  });

  describe('when the onWaiting function is called', () => {
    const onWaitingCallbackMock = vi.fn();

    beforeAll(() => {
      player.onWaiting(onWaitingCallbackMock);
      audioEvents.waiting();
    });

    it('calls the onWaiting callback', () => {
      expect(onWaitingCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onTimeupdate function is called', () => {
    const onTimeupdateCallbackMock = vi.fn();

    beforeAll(() => {
      player.onTimeupdate(onTimeupdateCallbackMock);
    });

    describe('when currentTime is 0', () => {
      beforeAll(() => {
        audioMock.currentTime = 0;
        audioEvents.timeupdate();
      });

      it('does not call the callback', () => {
        expect(onTimeupdateCallbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when currentTime is greater than 0', () => {
      beforeAll(() => {
        audioMock.currentTime = 10.7;
        audioEvents.timeupdate();
      });

      it('calls the callback with the correct parameters', () => {
        expect(onTimeupdateCallbackMock).toHaveBeenCalledWith(10);
      });
    });
  });

  describe('when the onBuffered function is called', () => {
    const onBufferedCallbackMock = vi.fn();

    beforeAll(() => {
      player.onBuffered(onBufferedCallbackMock);
    });

    describe('when the audio duration is 0', () => {
      beforeAll(() => {
        audioMock.duration = 0;
        audioEvents.progress();
      });

      it('does not call the callback', () => {
        expect(onBufferedCallbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when the audio duration is greater than 0', () => {
      describe('when the buffered range does not contain the currentTime', () => {
        beforeAll(() => {
          audioMock.buffered = {
            end: vi.fn(() => 30),
            length: 1,
            start: vi.fn(() => 20),
          } as unknown as TimeRanges;
          audioMock.currentTime = 10;
          audioMock.duration = 60;
          audioEvents.progress();
        });

        it('does not call the callback', () => {
          expect(onBufferedCallbackMock).not.toHaveBeenCalled();
        });
      });

      describe('when the buffered range contains the currentTime', () => {
        beforeAll(() => {
          audioMock.buffered = {
            end: vi.fn(() => 30),
            length: 1,
            start: vi.fn(() => 0),
          } as unknown as TimeRanges;
          audioMock.currentTime = 10;
          audioMock.duration = 60;
          audioEvents.progress();
        });

        it('calls the callback with the correct parameters', () => {
          expect(onBufferedCallbackMock).toHaveBeenCalledWith(30);
        });
      });
    });
  });

  describe('when the loadFromElement function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      player.loadFromElement(newAudioMock as unknown as HTMLAudioElement);
    });

    it('calls the disconnect function', () => {
      expect(sourceNodeMock.disconnect).toHaveBeenCalled();
    });

    it('calls the removeEventListener function', () => {
      expect(removeEventListenerMock).toHaveBeenCalled();
    });

    it('calls the pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('sets the correct src value', () => {
      expect(audioMock.src).toBe('');
    });

    it('calls the removeAttribute function with the correct parameters', () => {
      expect(removeAttributeMock).toHaveBeenCalledWith('src');
    });

    it('calls the load function', () => {
      expect(audioLoadMock).toHaveBeenCalled();
    });

    it('calls the addEventListener function', () => {
      expect(newAddEventListenerMock).toHaveBeenCalled();
    });

    it('calls the createMediaElementSource function with the correct parameters', () => {
      expect(createMediaElementSourceMock).toHaveBeenCalledWith(newAudioMock);
    });

    it('calls the connect function with the correct parameters', () => {
      expect(sourceNodeMock.connect).toHaveBeenCalledWith(replayGainNodeMock);
    });
  });

  describe('when the applyReplayGain function is called', () => {
    describe('when the mode is off', () => {
      beforeAll(() => {
        replayGainNodeMock.gain.value = 5;
        player.applyReplayGain('off', -6, -3, 0.9);
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(1);
      });
    });

    describe('when the mode is track', () => {
      beforeAll(() => {
        player.applyReplayGain('track', -6);
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(Math.pow(10, -6 / 20));
      });
    });

    describe('when the mode is album', () => {
      beforeAll(() => {
        player.applyReplayGain('album', -6, -3);
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(Math.pow(10, -3 / 20));
      });
    });

    describe('when the computed gain would exceed the peak headroom', () => {
      beforeAll(() => {
        player.applyReplayGain('track', 12, undefined, 0.9);
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(1 / 0.9);
      });
    });

    describe('when the mode is track with no gain value', () => {
      beforeAll(() => {
        player.applyReplayGain('track');
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(1);
      });
    });

    describe('when the mode is album with no gain value', () => {
      beforeAll(() => {
        player.applyReplayGain('album');
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(1);
      });
    });

    describe('when the peak value is 0', () => {
      beforeAll(() => {
        player.applyReplayGain('track', 6, undefined, 0);
      });

      it('sets the correct replayGain node gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(Math.pow(10, 6 / 20));
      });
    });
  });

  describe('when load is called again', () => {
    beforeAll(() => {
      createMediaElementSourceMock.mockClear();
      sourceNodeMock.disconnect.mockClear();
      player.load('stream-url-again');
    });

    it('calls the disconnect function', () => {
      expect(sourceNodeMock.disconnect).toHaveBeenCalled();
    });

    it('calls the createMediaElementSource function', () => {
      expect(createMediaElementSourceMock).toHaveBeenCalled();
    });
  });

  describe('when the createMediaElementSource function throws an error', () => {
    beforeAll(() => {
      audioElementMock();
      createMediaElementSourceMock.mockImplementationOnce(() => {
        throw new Error('CORS');
      });
      volumeNodeMock.gain.value = 1;
      replayGainNodeMock.gain.value = 1;
      player.loadFromElement(newAudioMock as unknown as HTMLAudioElement);
    });

    it('does not set the volume node gain value', () => {
      player.setVolume(0.5);
      expect(volumeNodeMock.gain.value).toBe(1);
    });

    it('does not set the replayGain node gain value', () => {
      player.applyReplayGain('track', -6);
      expect(replayGainNodeMock.gain.value).toBe(1);
    });

    it('returns null', () => {
      expect(player.getCrossfadeGainNode()).toBe(null);
    });

    describe('when the load function is called again', () => {
      beforeAll(() => {
        createGainMock.mockClear();
        player.load('stream-url-retry');
      });

      it('calls the createGain function', () => {
        expect(createGainMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the destroy function is called', () => {
    beforeAll(() => {
      audioContextCloseMock.mockClear();
      player.destroy();
    });

    it('calls the close function', () => {
      expect(audioContextCloseMock).toHaveBeenCalled();
    });

    it('returns null', () => {
      expect(player.getCrossfadeGainNode()).toBe(null);
    });

    describe('when the player is played again after being destroyed', () => {
      beforeAll(async () => {
        createGainMock.mockClear();
        await player.play();
      });

      it('calls the createGain function', () => {
        expect(createGainMock).toHaveBeenCalled();
      });
    });
  });

  describe('when constructed with an injected AudioContext', () => {
    let injectedPlayer: AudioPlayer;

    beforeAll(() => {
      // Re-initialise mock queue (vi.clearAllMocks resets return values).
      audioElementMock();
      injectedPlayer = new AudioPlayer(
        audioContextMock as unknown as AudioContext,
      );
    });

    afterAll(() => {
      injectedPlayer.destroy();
    });

    it('does not call the AudioContext constructor', () => {
      expect(globalThis.AudioContext).not.toHaveBeenCalled();
    });

    it('calls the createGain function', () => {
      expect(createGainMock).toHaveBeenCalledTimes(3);
    });

    it('connects the replayGain node to the crossfadeGain node', () => {
      expect(replayGainNodeMock.connect).toHaveBeenCalledWith(
        crossfadeGainNodeMock,
      );
    });

    it('connects the crossfadeGain node to the volume node', () => {
      expect(crossfadeGainNodeMock.connect).toHaveBeenCalledWith(
        volumeNodeMock,
      );
    });

    it('connects the volume node to the destination', () => {
      expect(volumeNodeMock.connect).toHaveBeenCalledWith(
        audioContextMock.destination,
      );
    });

    it('sets the correct crossfadeGain node gain value', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(1);
    });

    describe('when destroyed', () => {
      beforeAll(() => {
        audioContextCloseMock.mockClear();
        injectedPlayer.destroy();
      });

      it('does not call the close function', () => {
        expect(audioContextCloseMock).not.toHaveBeenCalled();
      });

      it('returns null', () => {
        expect(injectedPlayer.getCrossfadeGainNode()).toBe(null);
      });
    });
  });
});
