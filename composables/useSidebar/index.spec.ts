import { useSidebar } from './index';

const { collapsed, toggleCollapsed, width } = useSidebar();

describe('useSidebar', () => {
  it('sets the default collapsed value', () => {
    expect(collapsed.value).toBe(false);
  });

  it('sets the default width value', () => {
    expect(width.value).toBe('16rem');
  });

  describe('when the toggleCollapsed function is called', () => {
    beforeAll(() => {
      toggleCollapsed();
    });

    it('sets the correct collapsed value', () => {
      expect(collapsed.value).toBe(true);
    });

    it('sets the correct width value', () => {
      expect(width.value).toBe('5rem');
    });

    describe('when the toggleCollapsed function is called again', () => {
      beforeAll(() => {
        toggleCollapsed();
      });

      it('sets the correct collapsed value', () => {
        expect(collapsed.value).toBe(false);
      });

      it('sets the correct width value', () => {
        expect(width.value).toBe('16rem');
      });
    });
  });
});
