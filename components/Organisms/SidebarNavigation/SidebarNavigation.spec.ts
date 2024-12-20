import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import SidebarNavigation from './SidebarNavigation.vue';

const toggleMock = vi.fn();
const collapsedMock = ref(false);

mockNuxtImport('useSidebar', () => () => ({
  collapsed: collapsedMock,
  toggle: toggleMock,
}));

function factory(props = {}) {
  return mount(SidebarNavigation, {
    props: {
      ...props,
    },
  });
}

describe('SidebarNavigation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when collapsed is false', () => {
    it('does not add the collapsed class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('collapsed');
    });

    it('sets the correct icon on the toggle button', () => {
      expect(wrapper.findComponent({ ref: 'toggleButton' }).props('icon')).toBe(
        'PhTextOutdent',
      );
    });

    it('sets the correct title attribute on the toggle button', () => {
      expect(
        wrapper.findComponent({ ref: 'toggleButton' }).attributes('title'),
      ).toBe('Close Navigation');
    });

    it('sets the correct slot data on the toggle button', () => {
      expect(wrapper.findComponent({ ref: 'toggleButton' }).text()).toContain(
        'Close Navigation',
      );
    });
  });

  describe('when collapsed is true', () => {
    beforeEach(() => {
      collapsedMock.value = true;
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the collapsed class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('collapsed');
    });

    it('sets the correct icon on the toggle button', () => {
      expect(wrapper.findComponent({ ref: 'toggleButton' }).props('icon')).toBe(
        'PhTextIndent',
      );
    });

    it('sets the correct title attribute on the toggle button', () => {
      expect(
        wrapper.findComponent({ ref: 'toggleButton' }).attributes('title'),
      ).toBe('Open Navigation');
    });

    it('sets the correct slot data on the toggle button', () => {
      expect(wrapper.findComponent({ ref: 'toggleButton' }).text()).toContain(
        'Open Navigation',
      );
    });
  });

  describe('when the toggle ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'toggleButton' }).vm.$emit('click');
    });

    it('calls the toggle function', () => {
      expect(toggleMock).toHaveBeenCalled();
    });
  });
});
