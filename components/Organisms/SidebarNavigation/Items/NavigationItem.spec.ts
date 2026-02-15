import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NavigationItem from './NavigationItem.vue';

function factory(props = {}, slots = {}) {
  return mount(NavigationItem, {
    props: {
      collapsed: false,
      title: 'title',
      ...props,
    },
    slots: {
      ...slots,
    },
  });
}

describe('NavigationItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the collapsed prop is false', () => {
    it('does not add the visuallyHidden class to the title element', () => {
      expect(wrapper.find({ ref: 'title' }).classes()).not.toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when the collapsed prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        collapsed: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the visuallyHidden class to the title element', () => {
      expect(wrapper.find({ ref: 'title' }).classes()).toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when slot data is not added', () => {
    it('does not show the navigation element', () => {
      expect(wrapper.find({ ref: 'navigation' }).exists()).toBe(false);
    });
  });

  describe('when slot data is added', () => {
    beforeEach(() => {
      wrapper = factory(undefined, {
        default: 'Default slot content.',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the navigation element', () => {
      expect(wrapper.find({ ref: 'navigation' }).exists()).toBe(true);
    });
  });
});
