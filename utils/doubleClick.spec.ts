import { doubleClick } from './doubleClick';

vi.useFakeTimers();

const callbackMock = vi.fn();

describe('doubleClick', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.runOnlyPendingTimers();
  });

  describe('when doubleClick is called once', () => {
    beforeEach(() => {
      doubleClick(callbackMock);
    });

    it('does not call the callback', () => {
      expect(callbackMock).not.toHaveBeenCalled();
    });
  });

  describe('when doubleClick is called again after 250ms', () => {
    beforeEach(() => {
      doubleClick(callbackMock);
      vi.advanceTimersByTime(300);
      doubleClick(callbackMock);
    });

    it('does not call the callback', () => {
      expect(callbackMock).not.toHaveBeenCalled();
    });
  });

  describe('when doubleClick is called again within 250ms', () => {
    beforeEach(() => {
      doubleClick(callbackMock);
      doubleClick(callbackMock);
    });

    it('calls the callback', () => {
      expect(callbackMock).toHaveBeenCalled();
    });
  });

  describe('when called four times rapidly', () => {
    beforeEach(() => {
      doubleClick(callbackMock);
      doubleClick(callbackMock);
      doubleClick(callbackMock);
      doubleClick(callbackMock);
    });

    it('calls the callback twice', () => {
      expect(callbackMock).toHaveBeenCalledTimes(2);
    });
  });
});
