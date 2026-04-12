import { audioElementMock } from '@/test/audioElementMock';

import { AudioPlayer } from './player';

const {
  audio,
  audioLoadMock,
  eventHandlers,
  pauseMock,
  playMock,
  removeAttributeMock,
  removeEventListenerMock,
  setAttributeMock,
} = audioElementMock();
const { addEventListenerMock: newAddEventListenerMock, audio: newAudio } =
  audioElementMock();

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
      expect(audio.playbackRate).toBe(1.5);
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

  describe('when the load function is called', () => {
    beforeAll(() => {
      player.load('stream-url');
    });

    it('calls the audio pause function', () => {
      expect(pauseMock).toHaveBeenCalled();
    });

    it('calls the audio setAttribute function with the correct parameters', () => {
      expect(setAttributeMock).toHaveBeenCalledWith('src', 'stream-url');
    });

    it('calls the audio load function', () => {
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

    it('calls the audio play function', () => {
      expect(playMock).toHaveBeenCalled();
    });
  });

  describe('when the setCurrentTime function is called', () => {
    beforeAll(() => {
      player.setCurrentTime(42);
    });

    it('sets the correct currentTime value', () => {
      expect(audio.currentTime).toBe(42);
    });
  });

  describe('when the setVolume function is called', () => {
    describe('when value is greater than 1', () => {
      beforeAll(() => {
        player.setVolume(2);
      });

      it('sets the correct volume value', () => {
        expect(audio.volume).toBe(1);
      });
    });

    describe('when value is less than 0', () => {
      beforeAll(() => {
        player.setVolume(-1);
      });

      it('sets the correct volume value', () => {
        expect(audio.volume).toBe(0);
      });
    });

    describe('when value is in between 0 and 1', () => {
      beforeAll(() => {
        player.setVolume(0.75);
      });

      it('sets the correct volume value', () => {
        expect(audio.volume).toBe(0.75);
      });
    });
  });

  describe('when the onCanPlay function is called', () => {
    const callbackMock = vi.fn();

    beforeAll(() => {
      player.onCanPlay(callbackMock);
    });

    describe('when the canplay event is fired', () => {
      beforeAll(() => {
        eventHandlers.canplay();
      });

      it('calls the callback', () => {
        expect(callbackMock).toHaveBeenCalled();
      });
    });

    describe('when the canplaythrough event is fired', () => {
      beforeAll(() => {
        eventHandlers.canplaythrough();
      });

      it('calls the callback', () => {
        expect(callbackMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the onEnded function is called', () => {
    const callbackMock = vi.fn();

    beforeAll(() => {
      player.onEnded(callbackMock);
      eventHandlers.ended();
    });

    it('calls the callback', () => {
      expect(callbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onLoadedMetadata function is called', () => {
    const callbackMock = vi.fn();

    beforeAll(() => {
      audio.duration = 180;
      player.onLoadedMetadata(callbackMock);
      eventHandlers.loadedmetadata();
    });

    it('calls the callback with the correct parameters', () => {
      expect(callbackMock).toHaveBeenCalledWith(180);
    });
  });

  describe('when the onWaiting function is called', () => {
    const callbackMock = vi.fn();

    beforeAll(() => {
      player.onWaiting(callbackMock);
      eventHandlers.waiting();
    });

    it('calls the callback', () => {
      expect(callbackMock).toHaveBeenCalled();
    });
  });

  describe('when the onTimeupdate function is called', () => {
    const callbackMock = vi.fn();

    beforeAll(() => {
      player.onTimeupdate(callbackMock);
    });

    describe('when currentTime is 0', () => {
      beforeAll(() => {
        audio.currentTime = 0;
        eventHandlers.timeupdate();
      });

      it('does not call the callback', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when currentTime is greater than 0', () => {
      beforeAll(() => {
        audio.currentTime = 10.7;
        eventHandlers.timeupdate();
      });

      it('calls the callback with the correct parameters', () => {
        expect(callbackMock).toHaveBeenCalledWith(10);
      });
    });
  });

  describe('when the onBuffered function is called', () => {
    const callbackMock = vi.fn();

    beforeAll(() => {
      player.onBuffered(callbackMock);
    });

    describe('when the audio duration is 0', () => {
      beforeAll(() => {
        audio.duration = 0;
        eventHandlers.progress();
      });

      it('does not call the callback', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when the audio duration is greater than 0', () => {
      describe('when the buffered range does not contain the currentTime', () => {
        beforeAll(() => {
          audio.buffered = {
            end: vi.fn(() => 30),
            length: 1,
            start: vi.fn(() => 20),
          } as unknown as TimeRanges;
          audio.currentTime = 10;
          audio.duration = 60;
          eventHandlers.progress();
        });

        it('does not call the callback', () => {
          expect(callbackMock).not.toHaveBeenCalled();
        });
      });

      describe('when the buffered range contains the currentTime', () => {
        beforeAll(() => {
          audio.buffered = {
            end: vi.fn(() => 30),
            length: 1,
            start: vi.fn(() => 0),
          } as unknown as TimeRanges;
          audio.currentTime = 10;
          audio.duration = 60;
          eventHandlers.progress();
        });

        it('calls the callback with the correct parameters', () => {
          expect(callbackMock).toHaveBeenCalledWith(30);
        });
      });
    });
  });

  describe('when the loadFromElement function is called', () => {
    beforeAll(() => {
      audio.volume = 0.5;
      player.loadFromElement(newAudio as unknown as HTMLAudioElement);
    });

    it('removes event listeners from the old element', () => {
      expect(removeEventListenerMock).toHaveBeenCalled();
    });

    it('adds event listeners to the new element', () => {
      expect(newAddEventListenerMock).toHaveBeenCalled();
    });

    it('sets the correct volume on the new element', () => {
      expect(newAudio.volume).toBe(0.5);
    });
  });
});
