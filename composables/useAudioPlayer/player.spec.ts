import { audioElementMock } from '@/test/audioElementMock';

import { AudioPlayer } from './player';

const {
  audioContextCloseMock,
  audioContextMock,
  audioContextResumeMock,
  audioLoadMock,
  audioMock,
  createGainMock,
  createMediaElementSourceMock,
  crossfadeGainNodeMock,
  fireEvent,
  masterVolumeNodeMock,
  pauseMock,
  playMock,
  removeAttributeMock,
  removeEventListenerMock,
  replayGainNodeMock,
  sourceNodeMock,
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

  describe('when setVolume is called before the audio context exists', () => {
    beforeAll(() => {
      player.setVolume(0.5);
    });

    it('does not set the masterVolume node gain value', () => {
      expect(masterVolumeNodeMock.gain.value).toBe(1);
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

  describe('when the load function is called', () => {
    beforeAll(() => {
      player.load('stream-url');
    });

    it('sets the correct volume gain value', () => {
      expect(masterVolumeNodeMock.gain.value).toBe(0.5);
    });

    it('sets the correct replayGain node gain value', () => {
      expect(replayGainNodeMock.gain.value).toBe(Math.pow(10, -6 / 20));
    });

    it('sets the correct crossfadeGain node gain value', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(1);
    });

    it('calls the connect function on the replayGainNode with the correct parameters', () => {
      expect(replayGainNodeMock.connect).toHaveBeenCalledWith(
        crossfadeGainNodeMock,
      );
    });

    it('calls the connect function on the crossfadeGainNode with the correct parameters', () => {
      expect(crossfadeGainNodeMock.connect).toHaveBeenCalledWith(
        masterVolumeNodeMock,
      );
    });

    it('calls the connect function on the masterVolumeNode with the correct parameters', () => {
      expect(masterVolumeNodeMock.connect).toHaveBeenCalledWith(
        audioContextMock.destination,
      );
    });

    it('calls the createMediaElementSource function with the correct parameters', () => {
      expect(createMediaElementSourceMock).toHaveBeenCalledWith(audioMock);
    });
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

    it('calls the removeAttribute function with the correct parameters', () => {
      expect(removeAttributeMock).toHaveBeenCalledWith('src');
    });

    it('calls the load function', () => {
      expect(audioLoadMock).toHaveBeenCalled();
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
        expect(masterVolumeNodeMock.gain.value).toBe(1);
      });
    });

    describe('when value is less than 0', () => {
      beforeAll(() => {
        player.setVolume(-1);
      });

      it('sets the correct volume value', () => {
        expect(masterVolumeNodeMock.gain.value).toBe(0);
      });
    });

    describe('when value is in between 0 and 1', () => {
      beforeAll(() => {
        player.setVolume(0.75);
      });

      it('sets the correct volume value', () => {
        expect(masterVolumeNodeMock.gain.value).toBe(0.75);
      });
    });
  });

  describe('when the onCanPlay function is called', () => {
    const onCanPlayCallbackMock = vi.fn();

    beforeAll(() => {
      player.onCanPlay(onCanPlayCallbackMock);
    });

    describe('when the canplay event is fired', () => {
      beforeAll(() => {
        fireEvent('canplay');
      });

      it('calls the onCanPlay callback', () => {
        expect(onCanPlayCallbackMock).toHaveBeenCalled();
      });
    });

    describe('when the canplaythrough event is fired', () => {
      beforeAll(() => {
        fireEvent('canplaythrough');
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
      fireEvent('pause');
    });

    it('calls the onPause callback', () => {
      expect(onPauseCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onPlay function is called', () => {
    const onPlayCallbackMock = vi.fn();

    beforeAll(() => {
      player.onPlay(onPlayCallbackMock);
      fireEvent('play');
    });

    it('calls the onPlay callback', () => {
      expect(onPlayCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onEnded function is called', () => {
    const onEndedCallbackMock = vi.fn();

    beforeAll(() => {
      player.onEnded(onEndedCallbackMock);
      fireEvent('ended');
    });

    it('calls the onEnded callback', () => {
      expect(onEndedCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onWaiting function is called', () => {
    const onWaitingCallbackMock = vi.fn();

    beforeAll(() => {
      player.onWaiting(onWaitingCallbackMock);
      fireEvent('waiting');
    });

    it('calls the onWaiting callback', () => {
      expect(onWaitingCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onStalled function is called', () => {
    const onStalledCallbackMock = vi.fn();

    beforeAll(() => {
      player.onStalled(onStalledCallbackMock);
      fireEvent('stalled');
    });

    it('calls the onStalled callback', () => {
      expect(onStalledCallbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onError function is called', () => {
    const onErrorCallbackMock = vi.fn();

    beforeAll(() => {
      player.onError(onErrorCallbackMock);
      fireEvent('error');
    });

    it('calls the onError callback', () => {
      expect(onErrorCallbackMock).toHaveBeenCalled();
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
        fireEvent('timeupdate');
      });

      it('does not call the callback', () => {
        expect(onTimeupdateCallbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when currentTime is greater than 0', () => {
      beforeAll(() => {
        audioMock.currentTime = 10.7;
        fireEvent('timeupdate');
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
        fireEvent('progress');
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
          fireEvent('progress');
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
          fireEvent('progress');
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
      createGainMock
        .mockReset()
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock)
        .mockReturnValue(masterVolumeNodeMock);
      player.loadFromElement(newAudioMock as unknown as HTMLAudioElement);
    });

    it('calls the disconnect function', () => {
      expect(sourceNodeMock.disconnect).toHaveBeenCalled();
    });

    it('calls the removeEventListener function', () => {
      expect(removeEventListenerMock).toHaveBeenCalled();
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('sets the correct src attribute on the audio element', () => {
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

    it('calls the connect function', () => {
      expect(sourceNodeMock.connect).toHaveBeenCalled();
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
      createGainMock
        .mockReset()
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock)
        .mockReturnValue(masterVolumeNodeMock);
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
      masterVolumeNodeMock.gain.value = 1;
      replayGainNodeMock.gain.value = 1;
      player.loadFromElement(newAudioMock as unknown as HTMLAudioElement);
    });

    it('does not affect the masterVolume node gain value', () => {
      player.setVolume(0.5);
      expect(masterVolumeNodeMock.gain.value).toBe(0.5);
    });

    it('does not set the replayGain node gain value', () => {
      player.applyReplayGain('track', -6);
      expect(replayGainNodeMock.gain.value).toBe(1);
    });

    describe('when the load function is called again', () => {
      beforeAll(() => {
        createGainMock
          .mockReset()
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock)
          .mockReturnValue(masterVolumeNodeMock);
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

    describe('when the player is played again after being destroyed', () => {
      beforeAll(async () => {
        createGainMock
          .mockReset()
          .mockReturnValueOnce(masterVolumeNodeMock)
          .mockReturnValue(masterVolumeNodeMock);
        await player.play();
      });

      it('calls the createGain function', () => {
        expect(createGainMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the progress event is fired after the player is destroyed', () => {
    const onProgressCallbackMock = vi.fn();

    beforeAll(() => {
      vi.clearAllMocks();
      player.onBuffered(onProgressCallbackMock);
      fireEvent('progress');
    });

    it('does not call the callback', () => {
      expect(onProgressCallbackMock).not.toHaveBeenCalled();
    });
  });

  describe('when the crossfadeTo function is called', () => {
    const onCrossfadeTriggerCallbackMock = vi.fn();

    beforeAll(() => {
      player.setCrossfadeDuration(() => 5);
      player.onCrossfadeTrigger(onCrossfadeTriggerCallbackMock);
      vi.clearAllMocks();
      audioMock.buffered = {
        end: vi.fn(),
        length: 0,
        start: vi.fn(),
      } as unknown as TimeRanges;

      createGainMock
        .mockReset()
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock)
        .mockReturnValue(masterVolumeNodeMock);

      player.load('first-url');

      createGainMock
        .mockReset()
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock)
        .mockReturnValue(masterVolumeNodeMock);

      player.crossfadeTo('second-url', 246);
    });

    it('calls the removeEventListener function 10 times', () => {
      expect(removeEventListenerMock).toHaveBeenCalledTimes(10);
    });

    it('calls the addEventListener function with the correct parameters for the ended event', () => {
      expect(newAddEventListenerMock).toHaveBeenCalledWith(
        'ended',
        expect.any(Function),
        {
          once: true,
        },
      );
    });

    it('calls the addEventListener function with the correct parameters for the error event', () => {
      expect(newAddEventListenerMock).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
        {
          once: true,
        },
      );
    });

    it('calls the linearRampToValueAtTime function with the correct parameters', () => {
      expect(
        crossfadeGainNodeMock.gain.linearRampToValueAtTime,
      ).toHaveBeenCalledWith(0, expect.any(Number));
    });

    it('sets the crossfadeGain node gain to 0', () => {
      expect(crossfadeGainNodeMock.gain.value).toBe(0);
    });

    it('calls the createMediaElementSource function with the correct parameters', () => {
      expect(createMediaElementSourceMock).toHaveBeenCalledWith(audioMock);
    });

    it('does not call the disconnect function', () => {
      expect(sourceNodeMock.disconnect).not.toHaveBeenCalled();
    });

    describe('when the transitionScheduler triggers crossfade', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        onCrossfadeTriggerCallbackMock.mockClear();
        audioMock.currentTime = 185;
        audioMock.duration = 190;
        fireEvent('timeupdate');
      });

      it('calls the onCrossfadeTrigger callback', () => {
        expect(onCrossfadeTriggerCallbackMock).toHaveBeenCalled();
      });
    });

    describe('when the ended event is fired on the fading track', () => {
      beforeAll(() => {
        createGainMock
          .mockReset()
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock)
          .mockReturnValue(masterVolumeNodeMock);
        player.crossfadeTo('ended-test-url', 300);

        vi.clearAllMocks();

        fireEvent('ended');
      });

      it('calls the pause function on the fading track element', () => {
        expect(pauseMock).toHaveBeenCalled();
      });

      it('calls the removeAttribute function with the correct parameters', () => {
        expect(removeAttributeMock).toHaveBeenCalledWith('src');
      });
    });

    describe('when the error event is fired on the fading track', () => {
      beforeAll(() => {
        createGainMock
          .mockReset()
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock)
          .mockReturnValue(masterVolumeNodeMock);
        player.crossfadeTo('error-test-url', 300);

        vi.clearAllMocks();

        fireEvent('error');
      });

      it('calls the pause function on the fading track element', () => {
        expect(pauseMock).toHaveBeenCalled();
      });

      it('calls the removeAttribute function with the correct parameters', () => {
        expect(removeAttributeMock).toHaveBeenCalledWith('src');
      });
    });

    describe('when destroy is called with a fadingTrack', () => {
      beforeAll(() => {
        vi.clearAllMocks();

        createGainMock
          .mockReset()
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock)
          .mockReturnValue(masterVolumeNodeMock);
        player.crossfadeTo('third-url', 300);
        vi.clearAllMocks();

        player.destroy();
      });

      it('calls the removeEventListener function', () => {
        expect(removeEventListenerMock).toHaveBeenCalled();
      });

      it('calls the audio pause function', () => {
        expect(pauseMock).toHaveBeenCalled();
      });

      it('calls the close function', () => {
        expect(audioContextCloseMock).toHaveBeenCalled();
      });

      it('calls the removeAttribute function with the correct parameters', () => {
        expect(removeAttributeMock).toHaveBeenCalledWith('src');
      });
    });
  });

  describe('when the crossfadeToElement function is called', () => {
    beforeAll(async () => {
      player.setCrossfadeDuration(() => 4);
      vi.clearAllMocks();

      createGainMock
        .mockReset()
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock)
        .mockReturnValue(masterVolumeNodeMock);

      player.load('first-url');

      createGainMock
        .mockReset()
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock)
        .mockReturnValue(masterVolumeNodeMock);

      player.crossfadeToElement(audioMock as unknown as HTMLAudioElement, 180);
    });

    it('calls the removeEventListener function 10 times', () => {
      expect(removeEventListenerMock).toHaveBeenCalledTimes(10);
    });

    it('calls the addEventListener function with the correct parameters', () => {
      expect(newAddEventListenerMock).toHaveBeenCalledWith(
        'ended',
        expect.any(Function),
        {
          once: true,
        },
      );
    });

    it('calls the createMediaElementSource function with the correct parameters', () => {
      expect(createMediaElementSourceMock).toHaveBeenCalledWith(audioMock);
    });
  });

  describe('when constructed with an injected AudioContext', () => {
    let injectedPlayer: AudioPlayer;

    beforeAll(() => {
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
      expect(createGainMock).toHaveBeenCalledTimes(1);
    });

    it('calls the connect function on the masterVolumeNode with the correct parameters', () => {
      expect(masterVolumeNodeMock.connect).toHaveBeenCalledWith(
        audioContextMock.destination,
      );
    });

    describe('when destroyed', () => {
      beforeAll(() => {
        audioContextCloseMock.mockClear();
        injectedPlayer.destroy();
      });

      it('does not call the close function', () => {
        expect(audioContextCloseMock).not.toHaveBeenCalled();
      });
    });
  });
});
