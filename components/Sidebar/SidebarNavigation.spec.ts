import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import SidebarNavigation from './SidebarNavigation.vue';

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

  it('sets the correct width to wrapper', () => {
    expect(wrapper.attributes('style')).toBe('width: 16rem;');
  });

  it('sets the correct icon on toggle button', () => {
    expect(wrapper.findComponent({ ref: 'toggleButton' }).props('icon')).toBe(
      'angles-left',
    );
  });

  it('sets the correct title on toggle button', () => {
    expect(
      wrapper.findComponent({ ref: 'toggleButton' }).attributes('title'),
    ).toBe('Close Navigation');
  });

  describe('when toggle button is clicked', () => {
    beforeEach(async () => {
      wrapper.findComponent({ ref: 'toggleButton' }).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct width to wrapper', () => {
      expect(wrapper.attributes('style')).toBe('width: 5rem;');
    });

    it('sets the correct icon on toggle button', () => {
      expect(wrapper.findComponent({ ref: 'toggleButton' }).props('icon')).toBe(
        'angles-right',
      );
    });

    it('sets the correct title on toggle button', () => {
      expect(
        wrapper.findComponent({ ref: 'toggleButton' }).attributes('title'),
      ).toBe('Open Navigation');
    });
  });
});
