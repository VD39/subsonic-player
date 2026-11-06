import { useDropdownMenuState } from './state';

describe('useDropdownMenuState', () => {
  let composable: ReturnType<typeof useDropdownMenuState>;

  beforeAll(() => {
    composable = useDropdownMenuState();
  });

  beforeEach(() => {
    // Reset state before each test as the state is shared across tests.
    composable.menuOpenRevision.value = 0;
  });

  describe('when the setActiveMenuId function is called', () => {
    beforeEach(() => {
      composable.setActiveMenuId('some-menu-id');
    });

    it('sets the correct activeMenuId value', () => {
      expect(composable.activeMenuId.value).toBe('some-menu-id');
    });

    it('sets the isAnyOpen value with true', () => {
      expect(composable.isAnyOpen.value).toBe(true);
    });

    it('sets the menuOpenRevision value with 1', () => {
      expect(composable.menuOpenRevision.value).toBe(1);
    });

    describe('when the setActiveMenuId function is called again with the same menu id', () => {
      beforeEach(() => {
        composable.setActiveMenuId('some-menu-id');
      });

      it('sets the menuOpenRevision value with 2', () => {
        expect(composable.menuOpenRevision.value).toBe(2);
      });
    });
  });

  describe('when the clearActiveMenuId function is called', () => {
    beforeEach(() => {
      composable.setActiveMenuId('some-menu-id');
      composable.clearActiveMenuId();
    });

    it('sets the activeMenuId value to null', () => {
      expect(composable.activeMenuId.value).toBeNull();
    });

    it('sets the isAnyOpen value with false', () => {
      expect(composable.isAnyOpen.value).toBe(false);
    });

    it('sets the menuOpenRevision value with 0', () => {
      expect(composable.menuOpenRevision.value).toBe(0);
    });
  });
});
