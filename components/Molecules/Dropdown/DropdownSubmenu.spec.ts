import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import DropdownSubmenu from './DropdownSubmenu.vue';

const closeSubmenuMock = vi.fn();
const openSubmenuMock = vi.fn();
const toggleInlineMock = vi.fn();
const isHoverDeviceMock = ref(false);
const isOpenMock = ref(false);
const openedLeftMock = ref(false);
const submenuStyleMock = ref<Record<string, string>>({});

mockNuxtImport('useDropdownSubmenu', () => () => ({
  closeSubmenu: closeSubmenuMock,
  isHoverDevice: isHoverDeviceMock,
  isOpen: isOpenMock,
  openedLeft: openedLeftMock,
  openSubmenu: openSubmenuMock,
  submenuStyle: submenuStyleMock,
  toggleInline: toggleInlineMock,
}));

function factory(props = {}) {
  return mount(DropdownSubmenu, {
    attachTo: document.body,
    props: {
      text: 'Test Submenu',
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('DropdownSubmenu', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the isOpen value is false', () => {
    it('does not show the dropdown sub list element', () => {
      expect(wrapper.find({ ref: 'dropdownSubListRef' }).exists()).toBe(false);
    });
  });

  describe('when the isOpen value changes to true', () => {
    beforeEach(async () => {
      isOpenMock.value = true;
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the dropdown sub list element', () => {
      expect(wrapper.find({ ref: 'dropdownSubListRef' }).exists()).toBe(true);
    });

    describe('when the isOpen value changes to false', () => {
      beforeEach(async () => {
        isOpenMock.value = false;
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the dropdown sub list element', () => {
        expect(wrapper.find({ ref: 'dropdownSubListRef' }).exists()).toBe(
          false,
        );
      });
    });
  });

  describe('when the submenuStyle has no values', () => {
    beforeEach(async () => {
      isOpenMock.value = true;
      submenuStyleMock.value = {};
      await wrapper.vm.$nextTick();
    });

    it('does not add any style on the sub list element', () => {
      expect(
        wrapper.find({ ref: 'dropdownSubListRef' }).attributes('style'),
      ).toBeUndefined();
    });
  });

  describe('when the submenuStyle has values', () => {
    beforeEach(async () => {
      submenuStyleMock.value = {
        left: '20px',
        top: '10px',
      };

      await wrapper.vm.$nextTick();
    });

    it('adds the correct style on the sub list element', () => {
      const dropdownSubList = wrapper.find({ ref: 'dropdownSubListRef' });

      expect(dropdownSubList.attributes('style')).toContain('left: 20px;');
      expect(dropdownSubList.attributes('style')).toContain('top: 10px;');
    });
  });

  describe('when the isHoverDevice value is false', () => {
    beforeEach(async () => {
      isOpenMock.value = true;
      isHoverDeviceMock.value = false;
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not add a transition name', () => {
      expect(
        (wrapper.vm as unknown as { transitionName: string }).transitionName,
      ).toBe('');
    });

    it('adds the inlineSubmenu class to the sub list element', () => {
      expect(wrapper.find({ ref: 'dropdownSubListRef' }).classes()).toContain(
        'inlineSubmenu',
      );
    });

    it('does not add the dropdownOverlay class to the sub list element', () => {
      expect(
        wrapper.find({ ref: 'dropdownSubListRef' }).classes(),
      ).not.toContain('dropdownOverlay');
    });

    it('does not add the dropdownContent class to the list element', () => {
      expect(wrapper.find({ ref: 'dropdownListRef' }).classes()).not.toContain(
        'dropdownContent',
      );
    });

    describe('when the isOpen value is true', () => {
      beforeEach(async () => {
        isOpenMock.value = true;
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the caretUp icon', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          ICONS.caretUp,
        );
      });

      describe('when the isOpen value changes to false', () => {
        beforeEach(async () => {
          isOpenMock.value = false;
          await wrapper.vm.$nextTick();
        });

        it('shows the caretDown icon', () => {
          expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
            ICONS.caretDown,
          );
        });
      });
    });
  });

  describe('when the isHoverDevice value is true', () => {
    beforeEach(async () => {
      isOpenMock.value = true;
      isHoverDeviceMock.value = true;
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the caretRight icon', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.caretRight,
      );
    });

    it('does not add the inlineSubmenu class to the sub list element', () => {
      expect(
        wrapper.find({ ref: 'dropdownSubListRef' }).classes(),
      ).not.toContain('inlineSubmenu');
    });

    it('adds the dropdownOverlay class to the sub list element', () => {
      expect(wrapper.find({ ref: 'dropdownSubListRef' }).classes()).toContain(
        'dropdownOverlay',
      );
    });

    it('adds the dropdownContent class to the list element', () => {
      expect(wrapper.find({ ref: 'dropdownListRef' }).classes()).toContain(
        'dropdownContent',
      );
    });

    describe('when the openedLeft value is false', () => {
      it('adds the transition name to slide-in-right', () => {
        expect(
          (wrapper.vm as unknown as { transitionName: string }).transitionName,
        ).toBe('slide-in-right');
      });
    });

    describe('when the openedLeft value is true', () => {
      beforeEach(async () => {
        openedLeftMock.value = true;
        await wrapper.vm.$nextTick();
      });

      it('adds the transition name to slide-in-left', () => {
        expect(
          (wrapper.vm as unknown as { transitionName: string }).transitionName,
        ).toBe('slide-in-left');
      });

      describe('when the openedLeft value changes to false', () => {
        beforeEach(async () => {
          openedLeftMock.value = false;
          await wrapper.vm.$nextTick();
        });

        it('adds the transition name to slide-in-right', () => {
          expect(
            (wrapper.vm as unknown as { transitionName: string })
              .transitionName,
          ).toBe('slide-in-right');
        });
      });
    });
  });

  describe('when the mouseenter is triggered on the submenu', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'dropdownSubmenuRef' }).trigger('mouseenter');
    });

    it('calls the openSubmenu function', () => {
      expect(openSubmenuMock).toHaveBeenCalled();
    });
  });

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('calls the toggleInline function', () => {
      expect(toggleInlineMock).toHaveBeenCalled();
    });
  });
});
