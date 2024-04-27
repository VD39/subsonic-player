import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import IconButton from '@/components/Buttons/IconButton.vue';
import SidebarItems from './SidebarItems.vue';

const collapsedMock = ref(false);

mockNuxtImport('useSidebar', () => () => ({
  collapsed: collapsedMock,
}));

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

  describe('when items prop is set', () => {
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
          {
            component: 'div',
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
      expect(wrapper.findAllComponents(IconButton).length).toBe(2);
    });

    it('shows the correct amount of components', () => {
      expect(wrapper.findAll('[data-test-id="item-component"]').length).toBe(1);
    });

    describe('when collapsed value is false', () => {
      it('sets the correct show-text prop on the IconButton component', () => {
        expect(wrapper.findAllComponents(IconButton)[0].props('showText')).toBe(
          true,
        );
      });
    });

    describe('when collapsed value is true', () => {
      beforeEach(() => {
        collapsedMock.value = true;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct show-text prop on the IconButton component', () => {
        expect(wrapper.findAllComponents(IconButton)[0].props('showText')).toBe(
          false,
        );
      });
    });
  });
});
