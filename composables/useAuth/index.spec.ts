import { withSetup } from '@/test/withSetup';
import { useAuth } from './index';

const utilsMock = vi.hoisted(() => ({
  deleteLocalStorage: vi.fn(),
  generateRandomString: vi.fn().mockReturnValue('randomString'),
  loadSession: vi.fn().mockReturnValue({
    server: '',
    username: '',
    anotherValue: '',
  }),
  saveSession: vi.fn(),
}));

vi.mock('@/utils', () => utilsMock);

const servicesMock = vi.hoisted(() => ({
  queryWithError: vi.fn(),
}));

vi.mock('@/services', () => servicesMock);

vi.mock('crypto-js/md5', () => ({
  default: vi.fn().mockReturnValue('MD5'),
}));

describe('useTheme', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useAuth>>>;

  beforeEach(() => {
    result = withSetup(useAuth);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the userDetails value bases on loadSession', () => {
    expect(result.userDetails.value).toEqual({
      server: '',
      username: '',
      anotherValue: '',
    });
  });

  describe('when autoLogin is called', () => {
    describe('when server is undefined', () => {
      beforeEach(() => {
        result.autoLogin();
      });

      it('calls the deleteLocalStorage function', () => {
        expect(utilsMock.deleteLocalStorage).toHaveBeenCalled();
      });

      it('sets the isLoggedIn value to false', () => {
        expect(result.isLoggedIn.value).toBe(false);
      });
    });

    describe('when server is defined', () => {
      beforeEach(() => {
        utilsMock.loadSession.mockReturnValue({
          server: 'server',
          username: 'username',
        });
      });

      describe('when queryWithError is successful', () => {
        beforeEach(() => {
          servicesMock.queryWithError.mockResolvedValue('');
          result = withSetup(useAuth);
          result.autoLogin();
        });

        it('does not call the deleteLocalStorage function', () => {
          expect(utilsMock.deleteLocalStorage).not.toHaveBeenCalled();
        });

        it('sets the correct isLoggedIn value', () => {
          expect(result.isLoggedIn.value).toBe(true);
        });
      });

      describe('when queryWithError is not successful', () => {
        beforeEach(() => {
          servicesMock.queryWithError.mockRejectedValue('');
          result = withSetup(useAuth);
          result.autoLogin();
        });

        it('calls the deleteLocalStorage function', () => {
          expect(utilsMock.deleteLocalStorage).toHaveBeenCalled();
        });

        it('sets the correct isLoggedIn value', () => {
          expect(result.isLoggedIn.value).toBe(false);
        });
      });
    });
  });

  describe('when login is called', () => {
    describe('when queryWithError is successful', () => {
      beforeEach(() => {
        servicesMock.queryWithError.mockResolvedValue('');
        result = withSetup(useAuth);
        result.login({
          password: 'password',
          server: 'server',
          username: 'username',
        });
      });

      it('calls the saveSession function', () => {
        expect(utilsMock.saveSession).toHaveBeenCalledWith({
          hash: 'MD5',
          salt: 'randomString',
          server: 'server',
          username: 'username',
        });
      });

      it('sets the correct isLoggedIn value', () => {
        expect(result.isLoggedIn.value).toBe(true);
      });

      it('sets the correct errorMessage value', () => {
        expect(result.errorMessage.value).toBe('');
      });
    });

    describe('when queryWithError is not successful', () => {
      beforeEach(() => {
        servicesMock.queryWithError.mockRejectedValue({
          message: 'Error message.',
        });
        result = withSetup(useAuth);
        result.login({
          password: 'password',
          server: 'server',
          username: 'username',
        });
      });

      it('does not call the saveSession function', () => {
        expect(utilsMock.saveSession).not.toHaveBeenCalled();
      });

      it('sets the correct errorMessage value', () => {
        expect(result.errorMessage.value).toBe('Error message.');
      });

      it('sets the correct isLoggedIn value', () => {
        expect(result.isLoggedIn.value).toBe(false);
      });
    });
  });

  describe('when logout is called', () => {
    beforeEach(() => {
      result.logout();
    });

    it('calls the deleteLocalStorage function', () => {
      expect(utilsMock.deleteLocalStorage).toHaveBeenCalled();
    });

    it('sets the correct isLoggedIn value', () => {
      expect(result.isLoggedIn.value).toBe(false);
    });
  });
});
