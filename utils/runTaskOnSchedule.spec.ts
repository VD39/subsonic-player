import { runTaskOnSchedule } from './runTaskOnSchedule';

vi.useFakeTimers();

const taskMock = vi.fn();

describe('runTaskOnSchedule', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.runOnlyPendingTimers();
  });

  describe('when the task is scheduled at multiple milestones', () => {
    beforeEach(() => {
      runTaskOnSchedule('key', [0, 5, 10, 15], taskMock);
    });

    it('calls the task function at each milestone', () => {
      vi.advanceTimersByTime(0);
      expect(taskMock).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5000);
      expect(taskMock).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(5000);
      expect(taskMock).toHaveBeenCalledTimes(3);

      vi.advanceTimersByTime(5000);
      expect(taskMock).toHaveBeenCalledTimes(4);
    });
  });

  describe('when the task is scheduled again with the same key', () => {
    beforeEach(() => {
      runTaskOnSchedule('key', [0, 5, 10, 15], taskMock);
      runTaskOnSchedule('key', [0, 5, 10, 15], taskMock);

      vi.advanceTimersByTime(15000);
    });

    it('calls the task function only for the latest schedule', () => {
      expect(taskMock).toHaveBeenCalledTimes(4);
    });
  });

  describe('when the tasks are scheduled with different keys', () => {
    beforeEach(() => {
      runTaskOnSchedule('key1', [0, 5, 10, 15], taskMock);
      runTaskOnSchedule('key2', [0, 5, 10, 15], taskMock);

      vi.advanceTimersByTime(15000);
    });

    it('calls the task function for each key', () => {
      expect(taskMock).toHaveBeenCalledTimes(8);
    });
  });

  describe('when the milestones have passed', () => {
    beforeEach(() => {
      runTaskOnSchedule('key', [0, 5, 10, 15], taskMock);

      vi.advanceTimersByTime(15000);
    });

    it('does not call the task function again', () => {
      vi.advanceTimersByTime(15000);

      expect(taskMock).toHaveBeenCalledTimes(4);
    });
  });

  describe('when the milestones are an empty array', () => {
    beforeEach(() => {
      runTaskOnSchedule('key', [], taskMock);

      vi.advanceTimersByTime(1000);
    });

    it('does not call the task function', () => {
      expect(taskMock).not.toHaveBeenCalled();
    });
  });
});
