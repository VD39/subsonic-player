import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import HeaderWithAction from './HeaderWithAction.vue';

function factory(props = {}, slots = {}) {
  return mount(HeaderWithAction, {
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
      ...slots,
    },
  });
}

describe('HeaderWithAction', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when actions slot is not set', () => {
    it('does not show the actions wrapper', () => {
      expect(wrapper.find({ ref: 'actions' }).exists()).toBe(false);
    });
  });

  describe('when actions slot is set', () => {
    beforeEach(() => {
      wrapper = factory(undefined, {
        actions: 'Actions slot content.',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the actions wrapper', () => {
      expect(wrapper.find({ ref: 'actions' }).exists()).toBe(true);
    });
  });
});
