import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import PlayingLoader from './PlayingLoader.vue';

function factory() {
  return mount(PlayingLoader, {
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('PlayingLoader', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
