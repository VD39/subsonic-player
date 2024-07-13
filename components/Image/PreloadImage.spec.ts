import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import PreloadImage from './PreloadImage.vue';

function factory(props = {}) {
  return mount(PreloadImage, {
    props: {
      src: 'src',
      alt: 'alt',
      ...props,
    },
    attachTo: document.body,
  });
}

describe('Default', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  describe('when image is loading', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the placeholder', () => {
      expect(wrapper.find({ ref: 'placeholder' }).isVisible()).toBe(true);
    });

    it('does not show the image', () => {
      expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(false);
    });
  });

  describe('when image has finished loading', () => {
    beforeAll(async () => {
      await wrapper.find({ ref: 'img' }).trigger('load');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the placeholder', () => {
      expect(wrapper.find({ ref: 'placeholder' }).isVisible()).toBe(false);
    });

    it('shows the image', () => {
      expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(true);
    });
  });
});
