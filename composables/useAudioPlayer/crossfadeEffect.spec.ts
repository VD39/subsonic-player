import { CrossfadeEffect } from './crossfadeEffect';

const audioContextMock = {
  currentTime: 10,
} as unknown as AudioContext;

const gainNodeMock = {
  gain: {
    linearRampToValueAtTime: vi.fn(),
    setValueAtTime: vi.fn(),
    value: 0.5,
  },
} as unknown as GainNode;

describe('CrossfadeEffect', () => {
  let crossfadeEffect: CrossfadeEffect;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the fade function is called', () => {
    beforeEach(() => {
      crossfadeEffect = new CrossfadeEffect(audioContextMock);
      gainNodeMock.gain.value = 0.5;
      crossfadeEffect.fade(gainNodeMock, 0, 2);
    });

    it('calls the setValueAtTime function with the correct parameters', () => {
      expect(gainNodeMock.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 10);
    });

    it('calls the linearRampToValueAtTime function with the correct parameters', () => {
      expect(gainNodeMock.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
        0,
        12,
      );
    });

    describe('when the targetValue is 1', () => {
      beforeEach(() => {
        gainNodeMock.gain.value = 0;
        crossfadeEffect.fade(gainNodeMock, 1, 3);
      });

      it('calls the linearRampToValueAtTime function with the correct parameters', () => {
        expect(gainNodeMock.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
          1,
          13,
        );
      });
    });

    describe('when the duration is 0', () => {
      beforeEach(() => {
        gainNodeMock.gain.value = 0.5;
        crossfadeEffect.fade(gainNodeMock, 0, 0);
      });

      it('calls the linearRampToValueAtTime function with the correct parameters', () => {
        expect(gainNodeMock.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
          0,
          10,
        );
      });
    });
  });
});
