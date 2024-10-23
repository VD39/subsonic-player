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
      beforeAll(() => {
        addErrorSnack();
      });

      it('adds to the snacks value with correct values', () => {
        expect(snacks.value).toEqual(
          expect.arrayContaining([
            {
              content: 'Sorry, something went wrong. Please try again.',
              id: 'randomString',
              timer: expect.any(Object),
              type: 'error',
            },
          ]),
        );
      });
    });

    describe('when message is set', () => {
      beforeAll(() => {
        addErrorSnack('Content');
      });

      it('adds to the snacks value with correct values', () => {
        expect(snacks.value).toEqual(
          expect.arrayContaining([
            {
              content: 'Content',
              id: 'randomString',
              timer: expect.any(Object),
              type: 'error',
            },
          ]),
        );
      });
    });
  });

  describe('when addInfoSnack function is called', () => {
    beforeAll(() => {
      randomStringMock.value = 'randomString1';
      addInfoSnack('Content');
    });

    it('adds to the snacks value', () => {
      expect(snacks.value).toEqual(
        expect.arrayContaining([
          {
            content: 'Content',
            id: 'randomString1',
            timer: expect.any(Object),
            type: 'info',
          },
        ]),
      );
    });
  });

  describe('when addSuccessSnack function is called', () => {
    beforeAll(() => {
      randomStringMock.value = 'randomString2';
      addSuccessSnack('Content');
    });

    it('adds to the snacks value', () => {
      expect(snacks.value).toEqual(
        expect.arrayContaining([
          {
            content: 'Content',
            id: 'randomString2',
            timer: expect.any(Object),
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
          content: 'Sorry, something went wrong. Please try again.',
          id: 'randomString',
          timer: expect.any(Object),
          type: 'error',
        },
        {
          content: 'Content',
          id: 'randomString',
          timer: expect.any(Object),
          type: 'error',
        },
        {
          content: 'Content',
          id: 'randomString2',
          timer: expect.any(Object),
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
          content: 'Content',
          id: 'randomString2',
          timer: expect.any(Object),
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
          content: 'Content',
          id: 'randomString2',
          timer: expect.any(Object),
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
            content: 'Content',
            id: 'randomString2',
            timer: null,
            type: 'error',
          },
        ]);
      });
    });
  });
});
