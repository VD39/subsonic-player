import { useSidebar } from './index';

describe('useSidebar', () => {
  let composable: ReturnType<typeof useSidebar>;

  beforeAll(() => {
    composable = useSidebar();
  });

  it('sets the default collapsed value', () => {
    expect(composable.collapsed.value).toBe(false);
  });

  it('sets the default width value', () => {
    expect(composable.width.value).toBe('16rem');
  });

  describe('when the toggleCollapsed function is called', () => {
    beforeAll(() => {
      composable.toggleCollapsed();
    });

    it('sets the correct collapsed value', () => {
      expect(composable.collapsed.value).toBe(true);
    });

    it('sets the correct width value', () => {
      expect(composable.width.value).toBe('5rem');
    });

    describe('when the toggleCollapsed function is called again', () => {
      beforeAll(() => {
        composable.toggleCollapsed();
      });

      it('sets the correct collapsed value', () => {
        expect(composable.collapsed.value).toBe(false);
      });

      it('sets the correct width value', () => {
        expect(composable.width.value).toBe('16rem');
      });
    });
  });
});
