import { classListMock } from '@/test/classListMock';

import { useScrollLock } from './index';

const { addClassMock, removeClassMock } = classListMock();

describe('useScrollLock', () => {
  let composableWithoutGlobalClass: ReturnType<typeof useScrollLock>;
  let composableWithGlobalClass: ReturnType<typeof useScrollLock>;

  beforeAll(() => {
    composableWithoutGlobalClass = useScrollLock('no-class');

    composableWithGlobalClass = useScrollLock('with-global-class', [
      'global-class',
      'another-global-class',
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the lockScroll function is called', () => {
    describe('when no bodyClasses parameter is provided', () => {
      beforeAll(() => {
        composableWithoutGlobalClass.lockScroll();
      });

      it('only adds the lockScroll class to the document.body', () => {
        expect(addClassMock).toHaveBeenCalledTimes(1);
        expect(addClassMock).toHaveBeenCalledWith('lockScroll');
      });
    });

    describe('when a bodyClasses parameter is provided', () => {
      beforeAll(() => {
        composableWithGlobalClass.lockScroll();
      });

      it('adds the bodyClasses parameter to the document.body', () => {
        expect(addClassMock).toHaveBeenCalledWith(
          'global-class',
          'another-global-class',
        );
      });
    });
  });

  describe('when the unlockScroll function is called', () => {
    describe('when no bodyClasses parameter is provided', () => {
      beforeAll(() => {
        // Call both unlock functions to ensure that the lockScroll
        // class is removed when all locks are released.
        composableWithGlobalClass.unlockScroll();
        vi.clearAllMocks();
        composableWithoutGlobalClass.unlockScroll();
      });

      it('only removes the lockScroll class from the document.body', () => {
        expect(removeClassMock).toHaveBeenCalledTimes(1);
        expect(removeClassMock).toHaveBeenCalledWith('lockScroll');
      });
    });

    describe('when a bodyClasses parameter is provided', () => {
      beforeAll(() => {
        // Call both unlock functions to ensure that the lockScroll
        // class and globalClasses are removed when all locks are released.
        composableWithoutGlobalClass.unlockScroll();
        composableWithGlobalClass.unlockScroll();
      });

      it('removes the bodyClasses parameter from the document.body', () => {
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
        composableWithoutGlobalClass.lockScroll();
        composableWithGlobalClass.lockScroll();
        composableWithoutGlobalClass.unlockScroll();
      });

      it('does not remove the lockScroll class from the document.body', () => {
        expect(removeClassMock).not.toHaveBeenCalled();
      });
    });

    describe('when the unlockScroll function is called for all locks', () => {
      beforeAll(() => {
        composableWithGlobalClass.unlockScroll();
      });

      it('removes the lockScroll class from the document.body', () => {
        expect(removeClassMock).toHaveBeenCalledWith('lockScroll');
      });
    });
  });

  describe('when the same unlockScroll function is called multiple times', () => {
    beforeAll(() => {
      composableWithoutGlobalClass.lockScroll();
      composableWithGlobalClass.lockScroll();
      composableWithoutGlobalClass.lockScroll();
      composableWithoutGlobalClass.unlockScroll();
    });

    it('does not remove the lockScroll class from the document.body', () => {
      expect(removeClassMock).not.toHaveBeenCalledWith('lockScroll');
    });
  });
});
