import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import DropdownMenu from './DropdownMenu.vue';

const closeDropdownMenuMock = vi.fn();
const openDropdownMenuMock = vi.fn();
const isOpenMock = ref(false);
const menuStyleMock = ref<Record<string, string>>({});

mockNuxtImport('useDropdownMenu', () => () => ({
  closeDropdownMenu: closeDropdownMenuMock,
  isOpen: isOpenMock,
  menuStyle: menuStyleMock,
  openDropdownMenu: openDropdownMenuMock,
}));

function factory(props = {}) {
  return mount(DropdownMenu, {
    attachTo: document.body,
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('DropdownMenu', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when isOpen is false', () => {
    it('does not show the dropdown list element', () => {
      expect(wrapper.find({ ref: 'dropdownListRef' }).exists()).toBe(false);
    });

    it('does not emit the opened event', () => {
      expect(wrapper.emitted('opened')).toBeUndefined();
    });
  });

  describe('when isOpen changes to true', () => {
    beforeAll(async () => {
      isOpenMock.value = true;
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the dropdown list element', () => {
      expect(wrapper.find({ ref: 'dropdownListRef' }).exists()).toBe(true);
    });

    it('emits the opened event', () => {
      expect(wrapper.emitted('opened')).toEqual([[]]);
    });

    describe('when isOpen changes to false', () => {
      beforeAll(async () => {
        isOpenMock.value = false;
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the dropdown list element', () => {
        expect(wrapper.find({ ref: 'dropdownListRef' }).exists()).toBe(false);
      });

      it('emits the closed event', () => {
        expect(wrapper.emitted('closed')).toEqual([[]]);
      });
    });
  });

  describe('when the menuStyle has no values', () => {
    beforeAll(async () => {
      isOpenMock.value = true;
      menuStyleMock.value = {};

      await wrapper.vm.$nextTick();
    });

    it('does not set any style on the dropdown list element', () => {
      expect(
        wrapper.find({ ref: 'dropdownListRef' }).attributes('style'),
      ).toBeUndefined();
    });
  });

  describe('when the menuStyle has values', () => {
    beforeAll(async () => {
      isOpenMock.value = true;
      menuStyleMock.value = {
        left: '20px',
        top: '10px',
      };

      await wrapper.vm.$nextTick();
    });

    it('sets the correct style on the dropdown list element', () => {
      const dropdownElement = wrapper.find({ ref: 'dropdownListRef' });
      expect(dropdownElement.attributes('style')).toContain('top: 10px;');
      expect(dropdownElement.attributes('style')).toContain('left: 20px;');
    });
  });

  describe('when the openDropdownMenu function is called via expose', () => {
    beforeEach(() => {
      (
        wrapper.vm as unknown as { openDropdownMenu: () => void }
      ).openDropdownMenu();
    });

    it('calls the openDropdownMenu function from useDropdownMenu', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });

  describe('when the ButtonLink component is clicked', () => {
    describe('when isOpen is false', () => {
      beforeEach(() => {
        isOpenMock.value = false;
        wrapper.findComponent(ButtonLink).vm.$emit('click');
      });

      it('calls the openDropdownMenu function', () => {
        expect(openDropdownMenuMock).toHaveBeenCalled();
      });

      it('does not call the closeDropdownMenu function', () => {
        expect(closeDropdownMenuMock).not.toHaveBeenCalled();
      });
    });

    describe('when isOpen is true', () => {
      beforeEach(() => {
        isOpenMock.value = true;
        wrapper.findComponent(ButtonLink).vm.$emit('click');
      });

      it('calls the closeDropdownMenu function', () => {
        expect(closeDropdownMenuMock).toHaveBeenCalled();
      });

      it('does not call the openDropdownMenu function', () => {
        expect(openDropdownMenuMock).not.toHaveBeenCalled();
      });
    });
  });
});
