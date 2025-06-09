import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import DefaultImage from '@/components/Atoms/IconImage.vue';

import PreloadImage from './PreloadImage.vue';

function factory(props = {}) {
  return mount(PreloadImage, {
    attachTo: document.body,
    props: {
      image: 'image',
      ...props,
    },
  });
}

describe('Default', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when image prop is set to a none IMAGE_DEFAULT_BY_TYPE icon', () => {
    describe('when image prop is not a URL', () => {
      it('does not show the DefaultImage component', () => {
        expect(wrapper.findComponent(DefaultImage).exists()).toBe(false);
      });

      it('shows the img element', () => {
        expect(wrapper.find({ ref: 'img' }).exists()).toBe(true);
      });
    });

    describe('when image prop is a URL', () => {
      beforeEach(() => {
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
      beforeEach(() => {
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
        expect(wrapper.find({ ref: 'imageLoader' }).isVisible()).toBe(true);
      });

      it('does not show the image', () => {
        expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(false);
      });
    });

    describe('when image has finished loading', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'img' }).trigger('load');
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the placeholder', () => {
        expect(wrapper.find({ ref: 'imageLoader' }).isVisible()).toBe(false);
      });

      it('shows the image', () => {
        expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(true);
      });
    });
  });

  describe('when image prop is set to a IMAGE_DEFAULT_BY_TYPE icon', () => {
    describe.each([...Object.values(IMAGE_DEFAULT_BY_TYPE)])(
      'when image prop is set to %s',
      (image) => {
        beforeEach(() => {
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
});
