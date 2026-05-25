import { useDropdownMenuState } from './state';

const {
  activeMenuId,
  clearActiveMenuId,
  isAnyOpen,
  menuOpenRevision,
  setActiveMenuId,
} = useDropdownMenuState();

describe('useDropdownMenuState', () => {
  beforeEach(() => {
    // Reset state before each test as the state is shared across tests.
    menuOpenRevision.value = 0;
  });

  describe('when the setActiveMenuId function is called', () => {
    beforeEach(() => {
      setActiveMenuId('some-menu-id');
    });

    it('sets the correct activeMenuId value', () => {
      expect(activeMenuId.value).toBe('some-menu-id');
    });

    it('sets the isAnyOpen value with true', () => {
      expect(isAnyOpen.value).toBe(true);
    });

    it('sets the menuOpenRevision value with 1', () => {
      expect(menuOpenRevision.value).toBe(1);
    });

    describe('when the setActiveMenuId function is called again with the same menu id', () => {
      beforeEach(() => {
        setActiveMenuId('some-menu-id');
      });

      it('sets the menuOpenRevision value with 2', () => {
        expect(menuOpenRevision.value).toBe(2);
      });
    });
  });

  describe('when the clearActiveMenuId function is called', () => {
    beforeEach(() => {
      setActiveMenuId('some-menu-id');
      clearActiveMenuId();
    });

    it('sets the activeMenuId value to null', () => {
      expect(activeMenuId.value).toBe(null);
    });

    it('sets the isAnyOpen value with false', () => {
      expect(isAnyOpen.value).toBe(false);
    });

    it('sets the menuOpenRevision value with 0', () => {
      expect(menuOpenRevision.value).toBe(0);
    });
  });
});
