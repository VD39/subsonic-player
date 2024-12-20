import { useQueue } from './index';

const {
  queueListOpened,
  queuePlayerOpened,
  resetQueueState,
  toggleQueueList,
  toggleQueuePlayer,
} = useQueue();

describe('useQueue', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default queueListOpened value', () => {
    expect(queueListOpened.value).toBe(false);
  });

  it('sets the default queuePlayerOpened value', () => {
    expect(queuePlayerOpened.value).toBe(false);
  });

  describe('when toggleQueueList function is called', () => {
    beforeAll(() => {
      toggleQueueList();
    });

    it('sets the correct queueListOpened value', () => {
      expect(queueListOpened.value).toBe(true);
    });
  });

  describe('when toggleQueuePlayer function is called', () => {
    beforeAll(() => {
      toggleQueuePlayer();
    });

    it('sets the correct queuePlayerOpened value', () => {
      expect(queuePlayerOpened.value).toBe(true);
    });
  });

  describe('when resetQueueState function is called', () => {
    beforeAll(() => {
      resetQueueState();
    });

    it('sets the correct queueListOpened value', () => {
      expect(queueListOpened.value).toBe(false);
    });

    it('sets the correct queuePlayerOpened value', () => {
      expect(queuePlayerOpened.value).toBe(false);
    });
  });
});
