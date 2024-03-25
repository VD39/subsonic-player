import { loadSession, saveSession } from './session';

const { config } = vi.hoisted(() => ({
  config: {
    serverUrl: '',
  },
}));

vi.mock('@/config', () => ({
  config,
}));

const setLocalStorageMock = vi.fn();

vi.mock('./storage', () => ({
  setLocalStorage: () => setLocalStorageMock(),
  getLocalStorage: vi.fn(() => 'localStorage'),
}));

describe('loadSession', () => {
  describe('when serverUrl is not defined', () => {
    it('returns correct value', async () => {
      expect(loadSession()).toEqual({
        hash: 'localStorage',
        salt: 'localStorage',
        server: 'localStorage',
        username: 'localStorage',
      });
    });
  });

  describe('when serverUrl is defined', () => {
    beforeEach(() => {
      config.serverUrl = 'serverUrl';
    });

    it('returns correct value', () => {
      expect(loadSession()).toEqual({
        hash: 'localStorage',
        salt: 'localStorage',
        server: 'serverUrl',
        username: 'localStorage',
      });
    });
  });
});

describe('saveSession', () => {
  describe('when object is undefined', () => {
    beforeEach(() => {
      saveSession();
    });

    it('does not call the setLocalStorage function', () => {
      expect(setLocalStorageMock).not.toHaveBeenCalled();
    });
  });

  describe('when object has length of 2', () => {
    beforeEach(() => {
      saveSession({
        one: 'one',
        two: 'two',
      });
    });

    it('calls the setLocalStorage function 2 times', () => {
      expect(setLocalStorageMock).toHaveBeenCalledTimes(2);
    });
  });
});
