import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import ImageLoader from '@/components/Loaders/ImageLoader.vue';
import DefaultImage from './DefaultImage.vue';
import PreloadImage from './PreloadImage.vue';

function factory(props = {}) {
  return mount(PreloadImage, {
    props: {
      image: 'imageId',
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

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when image prop is set to a none DEFAULT_IMAGE_ICONS icon', () => {
    describe('when image prop is not a URL', () => {
      it('does not show the DefaultImage component', () => {
        expect(wrapper.findComponent(DefaultImage).exists()).toBe(false);
      });

      it('shows the img element', () => {
        expect(wrapper.find({ ref: 'img' }).exists()).toBe(true);
      });
    });

    describe('when image prop is a URL', () => {
      beforeAll(() => {
        wrapper = factory({
          image: 'https://test.com',
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the DefaultImage component', () => {
        expect(wrapper.findComponent(DefaultImage).exists()).toBe(false);
      });

      it('shows the img element', () => {
        expect(wrapper.find({ ref: 'img' }).exists()).toBe(true);
      });
    });

    describe('when alt prop is not set', () => {
      it('adds the default alt attribute', () => {
        expect(wrapper.find({ ref: 'img' }).attributes('alt')).toBe('Image');
      });
    });

    describe('when alt prop is set to true', () => {
      beforeAll(() => {
        wrapper = factory({
          alt: 'Alt text for image',
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the correct alt attribute', () => {
        expect(wrapper.find({ ref: 'img' }).attributes('alt')).toBe(
          'Alt text for image',
        );
      });
    });

    describe('when image is loading', () => {
      it('shows the placeholder', () => {
        expect(wrapper.findComponent(ImageLoader).isVisible()).toBe(true);
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
        expect(wrapper.findComponent(ImageLoader).isVisible()).toBe(false);
      });

      it('shows the image', () => {
        expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(true);
      });
    });
  });

  describe.each([...DEFAULT_IMAGE_ICONS])(
    'when image prop is set to %s',
    (image) => {
      beforeAll(() => {
        wrapper = factory({
          image,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the DefaultImage component', () => {
        expect(wrapper.findComponent(DefaultImage).exists()).toBe(true);
      });

      it('does not show the img element', () => {
        expect(wrapper.find({ ref: 'img' }).exists()).toBe(false);
      });
    },
  );
});
