import { classListMock } from '@/test/classListMock';

import { useScrollLock } from './index';

const { addClassMock, removeClassMock } = classListMock();

const {
  lockScroll: lockScrollWithoutGlobalClass,
  unlockScroll: unlockScrollWithoutGlobalClass,
} = useScrollLock('no-class');

const {
  lockScroll: lockScrollWithGlobalClass,
  unlockScroll: unlockScrollWithGlobalClass,
} = useScrollLock('with-global-class', [
  'global-class',
  'another-global-class',
]);

describe('useScrollLock', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the lockScroll function is called', () => {
    describe('when no globalClasses parameter is provided', () => {
      beforeAll(() => {
        lockScrollWithoutGlobalClass();
      });

      it('only adds the lockScroll class to the document.body', () => {
        expect(addClassMock).toHaveBeenCalledTimes(1);
        expect(addClassMock).toHaveBeenCalledWith('lockScroll');
      });
    });

    describe('when a globalClasses parameter is provided', () => {
      beforeAll(() => {
        lockScrollWithGlobalClass();
      });

      it('adds the globalClasses parameter to the document.body', () => {
        expect(addClassMock).toHaveBeenCalledWith(
          'global-class',
          'another-global-class',
        );
      });
    });
  });

  describe('when the unlockScroll function is called', () => {
    describe('when no globalClasses parameter is provided', () => {
      beforeAll(() => {
        // Call both unlock functions to ensure that the lockScroll
        // class is removed when all locks are released.
        unlockScrollWithGlobalClass();
        vi.clearAllMocks();
        unlockScrollWithoutGlobalClass();
      });

      it('only removes the lockScroll class from the document.body', () => {
        expect(removeClassMock).toHaveBeenCalledTimes(1);
        expect(removeClassMock).toHaveBeenCalledWith('lockScroll');
      });
    });

    describe('when a globalClasses parameter is provided', () => {
      beforeAll(() => {
        // Call both unlock functions to ensure that the lockScroll
        // class and globalClasses are removed when all locks are released.
        unlockScrollWithoutGlobalClass();
        unlockScrollWithGlobalClass();
      });

      it('removes the globalClasses parameter from the document.body', () => {
        expect(removeClassMock).toHaveBeenCalledWith(
          'global-class',
          'another-global-class',
        );
      });
    });
  });

  describe('when the lockScroll function is called multiple times', () => {
    describe('when the unlockScroll function is called once', () => {
      beforeAll(() => {
        lockScrollWithoutGlobalClass();
        lockScrollWithGlobalClass();
        unlockScrollWithoutGlobalClass();
      });

      it('does not remove the lockScroll class from the document.body', () => {
        expect(removeClassMock).not.toHaveBeenCalled();
      });
    });

    describe('when the unlockScroll function is called for all locks', () => {
      beforeAll(() => {
        unlockScrollWithGlobalClass();
      });

      it('removes the lockScroll class from the document.body', () => {
        expect(removeClassMock).toHaveBeenCalledWith('lockScroll');
      });
    });
  });

  describe('when the same unlockScroll function is called multiple times', () => {
    beforeAll(() => {
      lockScrollWithoutGlobalClass();
      lockScrollWithGlobalClass();
      unlockScrollWithoutGlobalClass();
      unlockScrollWithoutGlobalClass();
    });

    it('does not remove the lockScroll class from the document.body', () => {
      expect(removeClassMock).not.toHaveBeenCalledWith('lockScroll');
    });
  });
});
