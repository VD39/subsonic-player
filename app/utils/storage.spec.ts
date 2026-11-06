import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from './storage';

describe('getLocalStorage', () => {
  describe('when key in localStorage does not exist', () => {
    it('returns the correct response', () => {
      expect(getLocalStorage('key', 'fallback')).toBe('fallback');
    });
  });

  describe('when key is in localStorage', () => {
    describe('when value is a valid JSON', () => {
      beforeEach(() => {
        globalThis.localStorage.setItem(
          'key',
          JSON.stringify({
            storage: 'storage',
          }),
        );
      });

      it('returns the correct response', () => {
        expect(getLocalStorage('key', {})).toEqual({
          storage: 'storage',
        });
      });
    });

    describe('when value is not valid JSON', () => {
      beforeEach(() => {
        globalThis.localStorage.setItem('key', '{//}');
      });

      it('returns the correct response', () => {
        expect(getLocalStorage('key', 'default')).toBe('default');
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
      expect(globalThis.localStorage.getItem('testKey')).toEqual(
        JSON.stringify({
          storage: 'storage',
        }),
      );
    });
  });

  describe('when un-stringifiable data is passed', () => {
    beforeEach(() => {
      vi.spyOn(globalThis.localStorage, 'setItem');

      setLocalStorage('testKey', 100n);
    });

    it('does not call the localStorage.setItem function', () => {
      expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});

describe('deleteLocalStorage', () => {
  describe('when deleteLocalStorage function is called', () => {
    describe('with a parameter', () => {
      beforeEach(() => {
        localStorage.clear();
        globalThis.localStorage.setItem('key1', 'key');
        globalThis.localStorage.setItem('key2', 'key');
        deleteLocalStorage('key2');
      });

      it('deletes the key from localStorage', () => {
        expect(globalThis.localStorage).toEqual({
          key1: 'key',
        });
      });
    });
  });

  describe('without a parameter', () => {
    beforeEach(() => {
      deleteLocalStorage();
    });

    it('resets the localStorage', () => {
      expect(globalThis.localStorage).toEqual({});
    });
  });
});
