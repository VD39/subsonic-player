import { audioElementMock } from '@/test/audioElementMock';

import { AudioPreloader } from './preloader';

const { audioLoadMock, audioMock, fireEvent, removeAttributeMock } =
  audioElementMock();

describe('AudioPreloader', () => {
  let preloader: AudioPreloader;

  beforeAll(() => {
    preloader = new AudioPreloader();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('when the preload function is called', () => {
    beforeAll(() => {
      preloader.preload('stream-url');
    });

    it('sets the correct size value', () => {
      expect(preloader.size).toBe(1);
    });

    it('sets the correct audio src value', () => {
      expect(audioMock.src).toBe('stream-url');
    });

    describe('when the same url is preloaded again', () => {
      beforeAll(() => {
        preloader.preload('stream-url');
      });

      it('does not add a duplicate entry', () => {
        expect(preloader.size).toBe(1);
      });
    });
  });

  describe('when the has function is called', () => {
    describe('when the url is in the pool', () => {
      it('returns the correct response', () => {
        expect(preloader.has('stream-url')).toBe(true);
      });
    });

    describe('when the url is not in the pool', () => {
      it('returns the correct response', () => {
        expect(preloader.has('unknown-url')).toBe(false);
      });
    });
  });

  describe('when the consume function is called', () => {
    let result: ReturnType<AudioPreloader['consume']>;

    describe('when the url is not in the pool', () => {
      it('returns the correct response', () => {
        expect(preloader.consume('unknown-url')).toBeNull();
      });
    });

    describe('when the url is in the pool', () => {
      describe('when the audio element has no error', () => {
        beforeAll(() => {
          result = preloader.consume('stream-url');
        });

        it('returns the correct response', () => {
          expect(result).toBe(audioMock);
        });

        it('removes from the pool value', () => {
          expect(preloader.has('stream-url')).toBe(false);
        });

        it('sets the correct size value', () => {
          expect(preloader.size).toBe(0);
        });
      });

      describe('when the audio element has an error', () => {
        beforeAll(() => {
          audioMock.error = {
            code: 4,
            message: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
          } as MediaError;
          preloader.preload('error-url');
          result = preloader.consume('error-url');
        });

        afterAll(() => {
          audioMock.error = null;
        });

        it('returns the correct response', () => {
          expect(result).toBeNull();
        });

        it('removes from the pool value', () => {
          expect(preloader.has('error-url')).toBe(false);
        });

        it('calls the audio load function', () => {
          expect(audioLoadMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the error is triggered on the preloaded audio element', () => {
    beforeAll(() => {
      preloader.preload('error-event-url');
      fireEvent('error');
    });

    it('removes from the pool value', () => {
      expect(preloader.has('error-event-url')).toBe(false);
    });

    it('removes the audio src attribute', () => {
      expect(removeAttributeMock).toHaveBeenCalledWith('src');
    });

    it('calls the audio load function', () => {
      expect(audioLoadMock).toHaveBeenCalled();
    });
  });

  describe('when the clear function is called', () => {
    beforeAll(() => {
      preloader.preload('stream-url');

      preloader.clear();
    });

    it('sets the correct size value', () => {
      expect(preloader.size).toBe(0);
    });

    it('removes the audio src attribute', () => {
      expect(removeAttributeMock).toHaveBeenCalledWith('src');
    });

    it('calls the audio load function', () => {
      expect(audioLoadMock).toHaveBeenCalled();
    });
  });

  describe('when the prune function is called', () => {
    beforeAll(() => {
      preloader.preload('stream-url-1');
      preloader.preload('stream-url-2');

      preloader.prune(new Set(['stream-url-1']));
    });

    describe('when the url is in the set to keep', () => {
      it('does not remove the kept url from the pool', () => {
        expect(preloader.has('stream-url-1')).toBe(true);
      });
    });

    describe('when the url is not in the set to keep', () => {
      it('removes from the pool value', () => {
        expect(preloader.has('stream-url-2')).toBe(false);
      });

      it('removes the audio src attribute', () => {
        expect(removeAttributeMock).toHaveBeenCalledWith('src');
      });

      it('calls the audio load function', () => {
        expect(audioLoadMock).toHaveBeenCalled();
      });
    });
  });
});
