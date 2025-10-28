import { debounce } from './debounce';

vi.unmock('./debounce');

vi.useFakeTimers();

const callbackMock = vi.fn();

describe('debounce', () => {
  let debounceFunction: Promise<unknown>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when delay is not set', () => {
    beforeEach(() => {
      callbackMock.mockReturnValue('success');
      debounceFunction = debounce(callbackMock)();
      vi.advanceTimersByTime(200);
    });

    it('resolve the promise after the delay', async () => {
      await expect(debounceFunction).resolves.toEqual('success');
    });
  });

  describe('when delay is set', () => {
    beforeEach(() => {
      callbackMock.mockReturnValue('success');
      debounceFunction = debounce(callbackMock, 1000)();
      vi.advanceTimersByTime(1000);
    });

    it('resolve the promise after the specified delay', async () => {
      await expect(debounceFunction).resolves.toEqual('success');
    });
  });

  describe('when callback throws an error', () => {
    beforeEach(() => {
      callbackMock.mockImplementation(() => {
        throw new Error('new Error message.');
      });

      debounceFunction = debounce(callbackMock)();
      vi.advanceTimersByTime(200);
    });

    it('throws an error', async () => {
      await expect(debounceFunction).rejects.toThrow('new Error message.');
    });
  });

  describe('when called multiple times', () => {
    beforeEach(() => {
      callbackMock.mockReturnValue('success');

      const debounceFunction = debounce(callbackMock);

      debounceFunction('first');
      debounceFunction('second');
      debounceFunction('third');
      debounceFunction('fourth');

      vi.advanceTimersByTime(200);
    });

    it('calls the callback function once', () => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith('fourth');
    });
  });
});
