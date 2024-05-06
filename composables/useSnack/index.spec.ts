import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useSnack } from './index';

vi.useFakeTimers();

const randomStringMock = ref('randomString');

mockNuxtImport('generateRandomString', () => () => randomStringMock.value);

const {
  addErrorSnack,
  addInfoSnack,
  addSuccessSnack,
  clearAllSnack,
  removeSnack,
  snacks,
} = useSnack();

describe('useSnack', () => {
  it('sets the default snacks value', () => {
    expect(snacks.value).toEqual([]);
  });

  describe('when addErrorSnack function is called', () => {
    describe('when message is not set', () => {
      beforeEach(() => {
        addErrorSnack();
      });

      it('adds to the snacks value with correct values', () => {
        expect(snacks.value).toEqual(
          expect.arrayContaining([
            {
              timer: expect.any(Object),
              content: 'Sorry, something went wrong. Please try again.',
              id: 'randomString',
              type: 'error',
            },
          ]),
        );
      });
    });

    describe('when message is set', () => {
      beforeEach(() => {
        addErrorSnack('Content');
      });

      it('adds to the snacks value with correct values', () => {
        expect(snacks.value).toEqual(
          expect.arrayContaining([
            {
              timer: expect.any(Object),
              content: 'Content',
              id: 'randomString',
              type: 'error',
            },
          ]),
        );
      });
    });
  });

  describe('when addInfoSnack function is called', () => {
    beforeEach(() => {
      randomStringMock.value = 'randomString1';
      addInfoSnack('Content');
    });

    it('adds to the snacks value', () => {
      expect(snacks.value).toEqual(
        expect.arrayContaining([
          {
            timer: expect.any(Object),
            content: 'Content',
            id: 'randomString1',
            type: 'info',
          },
        ]),
      );
    });
  });

  describe('when addSuccessSnack function is called', () => {
    beforeEach(() => {
      randomStringMock.value = 'randomString2';
      addSuccessSnack('Content');
    });

    it('adds to the snacks value', () => {
      expect(snacks.value).toEqual(
        expect.arrayContaining([
          {
            timer: expect.any(Object),
            content: 'Content',
            id: 'randomString2',
            type: 'success',
          },
        ]),
      );
    });
  });

  describe('when removeSnack function is called', () => {
    beforeEach(() => {
      removeSnack('randomString1');
    });

    it('removes from snack from the snacks value', () => {
      expect(snacks.value).toEqual([
        {
          timer: expect.any(Object),
          content: 'Sorry, something went wrong. Please try again.',
          id: 'randomString',
          type: 'error',
        },
        {
          timer: expect.any(Object),
          content: 'Content',
          id: 'randomString',
          type: 'error',
        },
        {
          timer: expect.any(Object),
          content: 'Content',
          id: 'randomString2',
          type: 'success',
        },
      ]);
    });
  });

  describe('when clearAllSnack function is called', () => {
    beforeEach(() => {
      clearAllSnack();
    });

    it('clears the snacks value', () => {
      expect(snacks.value).toEqual([]);
    });
  });

  describe('when auto is set to true on a add snack functions', () => {
    beforeAll(() => {
      addErrorSnack('Content');
    });

    it('adds to the snacks value', () => {
      expect(snacks.value).toEqual([
        {
          timer: expect.any(Object),
          content: 'Content',
          id: 'randomString2',
          type: 'error',
        },
      ]);
    });

    describe('when 5 seconds have passed', () => {
      beforeEach(() => {
        vi.advanceTimersByTime(10000);
      });

      it('clears the snacks value', () => {
        expect(snacks.value).toEqual([]);
      });
    });
  });

  describe('when auto is set to false on a add snack functions', () => {
    beforeAll(() => {
      addErrorSnack('Content', false);
    });

    it('adds to the snacks value', () => {
      expect(snacks.value).toEqual([
        {
          timer: expect.any(Object),
          content: 'Content',
          id: 'randomString2',
          type: 'error',
        },
      ]);
    });

    describe('when 5 seconds have passed', () => {
      beforeEach(() => {
        vi.advanceTimersByTime(5000);
      });

      it('does not clears the snacks value', () => {
        expect(snacks.value).toEqual([
          {
            timer: null,
            content: 'Content',
            id: 'randomString2',
            type: 'error',
          },
        ]);
      });
    });
  });
});
