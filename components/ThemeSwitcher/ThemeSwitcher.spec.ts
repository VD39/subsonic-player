import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import IconButton from '@/components/Buttons/IconButton.vue';
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

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct icon prop', () => {
    expect(wrapper.findComponent(IconButton).props('icon')).toBe('moon');
  });

  it('shows the correct title prop', () => {
    expect(wrapper.findComponent(IconButton).attributes('title')).toBe(
      'Activate dark mode',
    );
  });

  it('shows the correct text', () => {
    expect(wrapper.findComponent(IconButton).text()).toBe('Activate dark mode');
  });

  describe('when button is clicked', () => {
    beforeAll(async () => {
      wrapper.findComponent(IconButton).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct icon prop', () => {
      expect(wrapper.findComponent(IconButton).props('icon')).toBe('sun');
    });

    it('shows the correct title prop', () => {
      expect(wrapper.findComponent(IconButton).attributes('title')).toBe(
        'Activate light mode',
      );
    });

    it('shows the correct text', () => {
      expect(wrapper.findComponent(IconButton).text()).toBe(
        'Activate light mode',
      );
    });
  });
});
