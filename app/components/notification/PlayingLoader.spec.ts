import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import PlayingLoader from './PlayingLoader.vue';

function factory(props = {}) {
  return mount(PlayingLoader, {
    props: {
      ...props,
    },
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

  describe('when the playing prop is not set', () => {
    it('does not add the playing class', () => {
      expect(wrapper.classes()).not.toContain('playing');
    });
  });

  describe('when the playing prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        playing: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the playing class', () => {
      expect(wrapper.classes()).toContain('playing');
    });
  });
});
