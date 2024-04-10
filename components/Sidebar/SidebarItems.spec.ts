import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import SidebarItems from './SidebarItems.vue';

function factory(props = {}) {
  return mount(SidebarItems, {
    props: {
      ...props,
    },
  });
}

describe('SidebarItems', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when title prop is not set', () => {
    it('does not show the title', () => {
      expect(wrapper.findComponent({ ref: 'rootTitle' }).exists()).toBe(false);
    });
  });

  describe('when title prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        title: 'title',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the title', () => {
      expect(wrapper.findComponent({ ref: 'rootTitle' }).exists()).toBe(true);
    });
  });

  describe('when items prop is not set', () => {
    it('does not show the title', () => {
      expect(wrapper.find({ ref: 'items' }).exists()).toBe(false);
    });
  });

  describe('when items prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        items: [
          {
            name: 'name',
            title: 'title',
            to: 'to',
            icon: 'icon',
          },
          {
            name: 'name',
            title: 'title',
            to: 'to',
            icon: 'icon',
          },
        ],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the items', () => {
      expect(wrapper.find({ ref: 'items' }).exists()).toBe(true);
    });

    it('shows the correct amount of item', () => {
      expect(wrapper.findAll('[data-test-id="item"]').length).toBe(2);
    });
  });
});
