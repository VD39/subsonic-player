import { useDropdownMenuState } from './state';

const {
  activeMenuId,
  clearActiveMenuId,
  isAnyOpen,
  openEventCount,
  setActiveMenuId,
} = useDropdownMenuState();

describe('useDropdownMenuState', () => {
  beforeEach(() => {
    // Reset state before each test as the state is shared across tests.
    openEventCount.value = 0;
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

    it('sets the openEventCount value with 1', () => {
      expect(openEventCount.value).toBe(1);
    });

    describe('when the setActiveMenuId function is called again with the same menu id', () => {
      beforeEach(() => {
        setActiveMenuId('some-menu-id');
      });

      it('sets the openEventCount value with 2', () => {
        expect(openEventCount.value).toBe(2);
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

    it('sets the openEventCount value with 0', () => {
      expect(openEventCount.value).toBe(0);
    });
  });
});
