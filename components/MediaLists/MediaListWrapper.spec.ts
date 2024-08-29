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

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when rows prop is not set', () => {
    it('sets the default styles', () => {
      expect(wrapper.attributes('style')).toBe('--loop-rows: 5;');
    });
  });

  describe('when rows prop is set', () => {
    beforeAll(() => {
      wrapper = factory({
        rows: '2',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the default styles', () => {
      expect(wrapper.attributes('style')).toBe('--loop-rows: 2;');
    });
  });
});
