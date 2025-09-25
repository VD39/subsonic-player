import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import ThemeSwitcher from './ThemeSwitcher.vue';

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

  it('sets the correct icon prop on the ButtonLink component', () => {
    expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
      ICONS.lightTheme,
    );
  });

  it('sets the correct title attribute on the ButtonLink component', () => {
    expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
      'Activate dark mode',
    );
  });

  it('sets the correct slot data on the toggle button', () => {
    expect(wrapper.findComponent(ButtonLink).text()).toBe('Activate dark mode');
  });

  describe('when ButtonLink component is clicked', () => {
    beforeAll(async () => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.darkTheme,
      );
    });

    it('sets the correct title attribute on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        'Activate light mode',
      );
    });

    it('updates the correct slot data on the toggle button', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toBe(
        'Activate light mode',
      );
    });
  });
});
