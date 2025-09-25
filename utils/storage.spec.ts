import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from './storage';

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('getLocalStorage', () => {
  let storage: ReturnType<typeof getLocalStorage>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when key in localStorage does not exist', () => {
    it('returns correct value', () => {
      expect(getLocalStorage('key')).toBe('');
    });
  });

  describe('when key is in localStorage', () => {
    describe('when value is a valid JSON', () => {
      beforeEach(() => {
        window.localStorage.setItem(
          'key',
          JSON.stringify({
            storage: 'storage',
          }),
        );

        storage = getLocalStorage('key');
      });

      it('returns correct value', () => {
        expect(storage).toEqual({
          storage: 'storage',
        });
      });
    });

    describe('when value is not valid JSON', () => {
      beforeEach(() => {
        window.localStorage.setItem('key', '{//}');
        storage = getLocalStorage('key');
      });

      it('calls the console.error function', () => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      it('returns correct value', () => {
        expect(storage).toBe('');
      });
    });
  });
});

describe('setLocalStorage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when valid data is passed', () => {
    beforeEach(() => {
      setLocalStorage('testKey', {
        storage: 'storage',
      });
    });

    it('sets the value to localStorage', () => {
      expect(window.localStorage.getItem('testKey')).toEqual(
        JSON.stringify({
          storage: 'storage',
        }),
      );
    });
  });

  describe('when invalid data is passed', () => {
    beforeEach(() => {
      vi.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('new Error message.');
      });

      setLocalStorage('testKey', {
        storage: 'storage',
      });
    });

    it('calls the console.error function with the correct parameters', () => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting local storage data for key "testKey":',
        expect.any(Error),
      );
    });
  });
});

describe('deleteLocalStorage', () => {
  describe('when deleteLocalStorage function is called', () => {
    describe('with a parameter', () => {
      beforeEach(() => {
        window.localStorage.setItem('key1', 'key');
        window.localStorage.setItem('key2', 'key');
        deleteLocalStorage('key2');
      });

      it('deletes the key from localStorage', () => {
        expect(window.localStorage).toEqual({
          key1: 'key',
          testKey: '{"storage":"storage"}',
        });
      });
    });
  });

  describe('without a parameter', () => {
    beforeEach(() => {
      deleteLocalStorage();
    });

    it('resets the localStorage', () => {
      expect(window.localStorage).toEqual({});
    });
  });
});
