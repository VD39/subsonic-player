import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MediaListWrapper from './MediaListWrapper.vue';

function factory(props = {}) {
  return mount(MediaListWrapper, {
    props: {
      ...props,
    },
  });
}

describe('MediaListWrapper', () => {
  let wrapper: VueWrapper;

  describe.each([
    ['mobile', '2'],
    ['tablet', '3'],
    ['desktop', '5'],
  ])('when %s prop is not set', (prop, defaultValue) => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the default styles', () => {
      expect(wrapper.attributes('style')).toContain(
        `--loop-rows-${prop}: ${defaultValue};`,
      );
    });
  });

  describe.each([
    ['mobile', '5'],
    ['tablet', '7'],
    ['desktop', '9'],
  ])('when %s prop is set', (prop, value) => {
    beforeEach(() => {
      wrapper = factory({
        [prop]: value,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute', () => {
      expect(wrapper.attributes('style')).toContain(
        `--loop-rows-${prop}: ${value};`,
      );
    });
  });
});
