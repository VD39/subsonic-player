import { useSidebar } from './index';

const { collapsed, navigation, toggle, width } = useSidebar();

describe('useSidebar', () => {
  it('sets the navigation', () => {
    expect(navigation).toEqual(SIDEBAR_NAVIGATION);
  });

  it('sets the default collapsed value', () => {
    expect(collapsed.value).toBe(false);
  });

  it('sets the default width value', () => {
    expect(width.value).toBe('16rem');
  });

  describe('when toggle function is called', () => {
    beforeAll(() => {
      toggle();
    });

    it('sets the correct collapsed value', () => {
      expect(collapsed.value).toBe(true);
    });

    it('sets the correct width value', () => {
      expect(width.value).toBe('5rem');
    });

    describe('when toggle function is called again', () => {
      beforeAll(() => {
        toggle();
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
