import { TransitionScheduler } from './transitionScheduler';

const callbackMock = vi.fn();

describe('TransitionScheduler', () => {
  let scheduler: TransitionScheduler;

  beforeEach(() => {
    scheduler = new TransitionScheduler();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the monitor function is called', () => {
    beforeEach(() => {
      scheduler.onTrigger(callbackMock);
    });

    describe('when the onTrigger function is not called before monitoring', () => {
      beforeEach(() => {
        scheduler = new TransitionScheduler();
        scheduler.monitor(8, 10, 3);
      });

      it('does not call the onTriggerCallback function', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when the remaining time is within the crossfade window', () => {
      beforeEach(() => {
        scheduler.monitor(8, 10, 3);
      });

      it('calls the onTriggerCallback function', () => {
        expect(callbackMock).toHaveBeenCalled();
      });
    });

    describe('when the duration is 0', () => {
      beforeEach(() => {
        scheduler.monitor(0, 0, 3);
      });

      it('does not call the onTriggerCallback function', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when the monitor function has already been triggered', () => {
      beforeEach(() => {
        scheduler.monitor(8, 10, 3);
        callbackMock.mockClear();
        scheduler.monitor(9, 10, 3);
      });

      it('does not call the onTriggerCallback function', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when the remaining time is outside the crossfade window', () => {
      beforeEach(() => {
        scheduler.monitor(0, 10, 3);
      });

      it('does not call the onTriggerCallback function', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the reset function is called', () => {
    beforeEach(() => {
      scheduler.onTrigger(callbackMock);
      scheduler.monitor(8, 10, 3);
      callbackMock.mockClear();
      scheduler.reset();
    });

    describe('when the monitor function is called', () => {
      beforeEach(() => {
        scheduler.monitor(8, 10, 3);
      });

      it('calls the onTriggerCallback function', () => {
        expect(callbackMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the setKnownDuration function is called', () => {
    beforeEach(() => {
      scheduler.onTrigger(callbackMock);
    });

    describe('when element duration is Infinity and within crossfade window', () => {
      beforeEach(() => {
        scheduler.setKnownDuration(200);
        scheduler.monitor(190, Infinity, 12);
      });

      it('calls the onTriggerCallback function', () => {
        expect(callbackMock).toHaveBeenCalled();
      });
    });

    describe('when element duration is NaN and within crossfade window', () => {
      beforeEach(() => {
        scheduler.setKnownDuration(200);
        scheduler.monitor(190, NaN, 12);
      });

      it('calls the onTriggerCallback function', () => {
        expect(callbackMock).toHaveBeenCalled();
      });
    });

    describe('when element duration is Infinity and outside crossfade window', () => {
      beforeEach(() => {
        scheduler.setKnownDuration(200);
        scheduler.monitor(0, Infinity, 12);
      });

      it('does not call the onTriggerCallback function', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when knownDuration is 0 and element duration is Infinity', () => {
      beforeEach(() => {
        scheduler.monitor(190, Infinity, 12);
      });

      it('does not call the onTriggerCallback function', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });

    describe('when the reset function is called', () => {
      beforeEach(() => {
        scheduler.setKnownDuration(200);
        scheduler.reset();
        scheduler.monitor(190, Infinity, 12);
      });

      it('clears the knownDuration value', () => {
        expect(callbackMock).not.toHaveBeenCalled();
      });
    });
  });
});
