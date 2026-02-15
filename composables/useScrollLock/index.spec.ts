import { classListMock } from '@/test/classListMock';

import { useScrollLock } from './index';

const { addClassMock, removeClassMock } = classListMock();

const { lockScroll, unlockScroll } = useScrollLock();

describe('useScrollLock', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the lockScroll function is called', () => {
    beforeAll(() => {
      lockScroll();
    });

    it('adds the lockScroll class to the document.body', () => {
      expect(addClassMock).toHaveBeenCalledWith('lockScroll');
    });

    describe('when no globalClasses parameter is provided', () => {
      it('does not call the document.body.classList.add function', () => {
        expect(addClassMock).not.toHaveBeenCalled();
      });
    });

    describe('when a globalClasses parameter is provided', () => {
      const { lockScroll } = useScrollLock([
        'global-class',
        'another-global-class',
      ]);

      beforeEach(() => {
        lockScroll();
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
    beforeAll(() => {
      unlockScroll();
    });

    it('removes the lockScroll class from the document.body', () => {
      expect(removeClassMock).toHaveBeenCalledWith('lockScroll');
    });

    describe('when no globalClasses parameter is provided', () => {
      it('does not call the document.body.classList.remove function', () => {
        expect(removeClassMock).not.toHaveBeenCalled();
      });
    });

    describe('when a globalClasses parameter is provided', () => {
      const { unlockScroll } = useScrollLock([
        'global-class',
        'another-global-class',
      ]);

      beforeEach(() => {
        unlockScroll();
      });

      it('removes the globalClasses parameter from the document.body', () => {
        expect(removeClassMock).toHaveBeenCalledWith(
          'global-class',
          'another-global-class',
        );
      });
    });
  });
});
