import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import HeaderWithAction from './HeaderWithAction.vue';

function factory() {
  return mount(HeaderWithAction, {
    slots: {
      default: 'Default slot content.',
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
});
