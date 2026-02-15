import { useDropdownMenuState } from './state';

const activeMenuId = useState<null | string>(
  STATE_NAMES.dropdownActiveMenuId,
  () => null,
);

const { isAnyOpen } = useDropdownMenuState();

describe('useDropdownMenuState', () => {
  afterEach(() => {
    activeMenuId.value = null;
  });

  describe('when no dropdown is active', () => {
    it('sets the isAnyOpen value with false', () => {
      expect(isAnyOpen.value).toBe(false);
    });
  });

  describe('when a dropdown is active', () => {
    beforeEach(() => {
      activeMenuId.value = 'some-menu-id';
    });

    it('updates the isAnyOpen value with true', () => {
      expect(isAnyOpen.value).toBe(true);
    });
  });

  describe('when the active menu id changes from a value to null', () => {
    beforeEach(() => {
      activeMenuId.value = null;
    });

    it('updates the isAnyOpen value with false', () => {
      expect(isAnyOpen.value).toBe(false);
    });
  });
});
