import { TrackInstance } from './trackInstance';

const crossfadeGainNodeMock = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  gain: {
    value: 1,
  },
};
const replayGainNodeMock = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  gain: {
    value: 1,
  },
};
const sourceNodeMock = {
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const createGainMock = vi.fn();
const createMediaElementSourceMock = vi.fn(() => sourceNodeMock);

const audioContextMock = {
  createGain: createGainMock,
  createMediaElementSource: createMediaElementSourceMock,
  destination: {},
} as unknown as AudioContext;

vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => ({}));

vi.spyOn(Element.prototype, 'removeAttribute').mockImplementation(() => ({}));

describe('TrackInstance', () => {
  let trackInstance: TrackInstance;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the source parameter is a string', () => {
    beforeEach(() => {
      trackInstance = new TrackInstance(
        audioContextMock,
        'https://example.com/audio.mp3',
        {} as AudioNode,
      );
    });

    it('sets the correct crossOrigin attribute on the element', () => {
      expect(trackInstance.element.crossOrigin).toBe('anonymous');
    });

    it('sets the correct preload attribute on the element', () => {
      expect(trackInstance.element.preload).toBe('auto');
    });

    it('sets the correct src attribute on the element', () => {
      expect(trackInstance.element.src).toContain('example.com/audio.mp3');
    });
  });

  describe('when the source parameter is an HTMLAudioElement', () => {
    beforeEach(() => {
      const element = document.createElement('audio');

      trackInstance = new TrackInstance(
        audioContextMock,
        element,
        {} as AudioNode,
      );
    });

    it('sets the element to the provided value', () => {
      expect(trackInstance.element).toBeInstanceOf(HTMLAudioElement);
    });
  });

  describe('when the connect function is called', () => {
    describe('when called successfully for the first time', () => {
      beforeEach(() => {
        createGainMock
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock);

        trackInstance = new TrackInstance(
          audioContextMock,
          'https://example.com/audio.mp3',
          {} as AudioNode,
        );

        trackInstance.connect(0.75);
      });

      it('sets the correct gain value on the replayGainNode', () => {
        expect(replayGainNodeMock.gain.value).toBe(0.75);
      });

      it('sets the correct gain value on the crossfadeGainNode', () => {
        expect(crossfadeGainNodeMock.gain.value).toBe(1);
      });

      it('sets the correct crossfadeGainNode value', () => {
        expect(trackInstance.crossfadeGainNode).toBe(crossfadeGainNodeMock);
      });

      it('calls the connect function on the sourceNode with the correct parameters', () => {
        expect(sourceNodeMock.connect).toHaveBeenCalledWith(replayGainNodeMock);
      });

      it('calls the connect function on the replayGainNode with the correct parameters', () => {
        expect(replayGainNodeMock.connect).toHaveBeenCalledWith(
          crossfadeGainNodeMock,
        );
      });

      it('calls the connect function on the crossfadeGainNode with the correct parameters', () => {
        expect(crossfadeGainNodeMock.connect).toHaveBeenCalledWith({});
      });
    });

    describe('when the Web Audio graph throws an error', () => {
      beforeEach(() => {
        createMediaElementSourceMock.mockImplementationOnce(() => {
          throw new Error('Web Audio error');
        });

        createGainMock
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock);

        trackInstance = new TrackInstance(
          audioContextMock,
          'https://example.com/audio.mp3',
          {} as AudioNode,
        );

        trackInstance.connect(1);
      });

      it('sets the crossfadeGainNode to null', () => {
        expect(trackInstance.crossfadeGainNode).toBeNull();
      });
    });

    describe('when the connect function has already been called', () => {
      beforeEach(() => {
        createGainMock
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock);

        trackInstance = new TrackInstance(
          audioContextMock,
          'https://example.com/audio.mp3',
          {} as AudioNode,
        );

        trackInstance.connect(1);
        vi.clearAllMocks();
        trackInstance.connect(1);
      });

      it('does not call the createMediaElementSource function', () => {
        expect(createMediaElementSourceMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the applyReplayGain function is called', () => {
    describe('when the replayGainNode exists', () => {
      beforeEach(() => {
        createGainMock
          .mockReturnValueOnce(replayGainNodeMock)
          .mockReturnValueOnce(crossfadeGainNodeMock);

        trackInstance = new TrackInstance(
          audioContextMock,
          'https://example.com/audio.mp3',
          {} as AudioNode,
        );

        trackInstance.connect(1);
        trackInstance.applyReplayGain(0.5);
      });

      it('sets the correct gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(0.5);
      });
    });

    describe('when the replayGainNode does not exist', () => {
      beforeEach(() => {
        replayGainNodeMock.gain.value = 1;

        trackInstance = new TrackInstance(
          audioContextMock,
          'https://example.com/audio.mp3',
          {} as AudioNode,
        );

        trackInstance.applyReplayGain(0.5);
      });

      it('does not set the gain value', () => {
        expect(replayGainNodeMock.gain.value).toBe(1);
      });
    });
  });

  describe('when the destroy function is called', () => {
    beforeEach(() => {
      createGainMock
        .mockReturnValueOnce(replayGainNodeMock)
        .mockReturnValueOnce(crossfadeGainNodeMock);

      trackInstance = new TrackInstance(
        audioContextMock,
        'https://example.com/audio.mp3',
        {} as AudioNode,
      );

      trackInstance.connect(1);
      trackInstance.destroy();
    });

    it('calls the audio pause function', () => {
      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    });

    it('calls the removeAttribute function with the correct parameters', () => {
      expect(Element.prototype.removeAttribute).toHaveBeenCalledWith('src');
    });

    it('calls the disconnect function on the sourceNode', () => {
      expect(sourceNodeMock.disconnect).toHaveBeenCalled();
    });

    it('calls the disconnect function on the replayGainNode', () => {
      expect(replayGainNodeMock.disconnect).toHaveBeenCalled();
    });

    it('calls the disconnect function on the crossfadeGainNode', () => {
      expect(crossfadeGainNodeMock.disconnect).toHaveBeenCalled();
    });

    it('sets the crossfadeGainNode to null', () => {
      expect(trackInstance.crossfadeGainNode).toBeNull();
    });
  });
});
