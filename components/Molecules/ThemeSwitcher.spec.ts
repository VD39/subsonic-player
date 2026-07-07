import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import ThemeSwitcher from './ThemeSwitcher.vue';

const isDarkThemeMock = ref(false);
const toggleThemeMock = vi.fn();

mockNuxtImport('useSettings', () => () => ({
  isDarkTheme: isDarkThemeMock,
  toggleTheme: toggleThemeMock,
}));

function factory(props = {}) {
  return mount(ThemeSwitcher, {
    props: {
      ...props,
    },
  });
}

describe('ThemeSwitcher', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the isDarkTheme value is false', () => {
    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.switchToDarkTheme,
      );
    });

    it('sets the correct title attribute on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        'Activate dark mode',
      );
    });

    it('sets the correct slot data on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toBe(
        'Activate dark mode',
      );
    });
  });

  describe('when the isDarkTheme value is true', () => {
    beforeEach(() => {
      isDarkThemeMock.value = true;
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.switchToLightTheme,
      );
    });

    it('sets the correct title attribute on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        'Activate light mode',
      );
    });

    it('sets the correct slot data on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toBe(
        'Activate light mode',
      );
    });
  });

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent(ButtonLink).trigger('click');
    });

    it('calls the toggleTheme function', () => {
      expect(toggleThemeMock).toHaveBeenCalled();
    });
  });
});
