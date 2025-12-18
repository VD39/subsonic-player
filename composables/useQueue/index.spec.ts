import { useQueue } from './index';

const {
  isQueueListOpened,
  isQueuePlayerOpened,
  resetQueue,
  toggleQueueList,
  toggleQueuePlayer,
} = useQueue();

describe('useQueue', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default isQueueListOpened value', () => {
    expect(isQueueListOpened.value).toBe(false);
  });

  it('sets the default isQueuePlayerOpened value', () => {
    expect(isQueuePlayerOpened.value).toBe(false);
  });

  describe('when toggleQueueList function is called', () => {
    beforeAll(() => {
      toggleQueueList();
    });

    it('sets the correct isQueueListOpened value', () => {
      expect(isQueueListOpened.value).toBe(true);
    });
  });

  describe('when toggleQueuePlayer function is called', () => {
    beforeAll(() => {
      toggleQueuePlayer();
    });

    it('sets the correct isQueuePlayerOpened value', () => {
      expect(isQueuePlayerOpened.value).toBe(true);
    });
  });

  describe('when resetQueue function is called', () => {
    beforeAll(() => {
      resetQueue();
    });

    it('sets the correct isQueueListOpened value', () => {
      expect(isQueueListOpened.value).toBe(false);
    });

    it('sets the correct isQueuePlayerOpened value', () => {
      expect(isQueuePlayerOpened.value).toBe(false);
    });
  });
});
