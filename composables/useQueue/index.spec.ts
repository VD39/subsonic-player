import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useQueue } from './index';

const lockScrollMock = vi.fn();
const unlockScrollMock = vi.fn();

mockNuxtImport('useScrollLock', () => () => ({
  lockScroll: lockScrollMock,
  unlockScroll: unlockScrollMock,
}));

const {
  isQueueListOpened,
  isQueuePlayerOpened,
  resetQueue,
  toggleQueueList,
  toggleQueuePlayer,
} = useQueue();

describe('useQueue', () => {
  it('sets the default isQueueListOpened value', () => {
    expect(isQueueListOpened.value).toBe(false);
  });

  it('sets the default isQueuePlayerOpened value', () => {
    expect(isQueuePlayerOpened.value).toBe(false);
  });

  describe('when the toggleQueueList function is called', () => {
    beforeAll(() => {
      toggleQueueList();
    });

    it('sets the correct isQueueListOpened value', () => {
      expect(isQueueListOpened.value).toBe(true);
    });

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when the toggleQueueList function is called again', () => {
      beforeAll(() => {
        toggleQueueList();
      });

      it('sets isQueueListOpened back to false', () => {
        expect(isQueueListOpened.value).toBe(false);
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the toggleQueuePlayer function is called', () => {
    beforeAll(() => {
      toggleQueuePlayer();
    });

    it('sets the correct isQueuePlayerOpened value', () => {
      expect(isQueuePlayerOpened.value).toBe(true);
    });

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when the toggleQueuePlayer function is called again', () => {
      beforeAll(() => {
        toggleQueuePlayer();
      });

      it('sets isQueuePlayerOpened back to false', () => {
        expect(isQueuePlayerOpened.value).toBe(false);
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });
    });
  });

  describe('when both queue list and player are opened', () => {
    beforeAll(() => {
      toggleQueueList();
      toggleQueuePlayer();
    });

    it('calls the lockScroll function when opening the player', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when the toggleQueueList is called to close the list', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        toggleQueueList();
      });

      it('calls the lockScroll function', () => {
        expect(lockScrollMock).toHaveBeenCalled();
      });

      it('does not call the unlockScroll function', () => {
        expect(unlockScrollMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the resetQueue function is called', () => {
    beforeAll(() => {
      resetQueue();
    });

    it('sets the correct isQueueListOpened value', () => {
      expect(isQueueListOpened.value).toBe(false);
    });

    it('sets the correct isQueuePlayerOpened value', () => {
      expect(isQueuePlayerOpened.value).toBe(false);
    });

    it('calls the unlockScroll function', () => {
      expect(unlockScrollMock).toHaveBeenCalled();
    });
  });
});
