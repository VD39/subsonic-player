import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import IconImage from '@/components/Atoms/IconImage.vue';
import { intersectionObserverMock } from '@/test/intersectionObserverMock';

import PreloadImage from './PreloadImage.vue';

function factory(props = {}) {
  return mount(PreloadImage, {
    attachTo: document.body,
    props: {
      image: IMAGE_DEFAULT_BY_TYPE.album,
      ...props,
    },
  });
}

describe('Default', () => {
  let wrapper: VueWrapper;
  let iOMock: ReturnType<typeof intersectionObserverMock>;

  beforeEach(() => {
    iOMock = intersectionObserverMock();
  });

  describe('when image prop is set to a IMAGE_DEFAULT_BY_TYPE icon', () => {
    describe.each(Object.values(IMAGE_DEFAULT_BY_TYPE))(
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

        it('does not add the IntersectionObserver function', () => {
          expect(iOMock.observeMock).not.toHaveBeenCalled();
        });

        it('shows the IconImage component', () => {
          expect(wrapper.findComponent(IconImage).exists()).toBe(true);
        });

        it('does not show the img element', () => {
          expect(wrapper.find({ ref: 'img' }).exists()).toBe(false);
        });

        describe('when component unmounts', () => {
          beforeEach(() => {
            wrapper.unmount();
          });

          it('does not call the IntersectionObserver disconnect function', () => {
            expect(iOMock.disconnectMock).not.toHaveBeenCalled();
          });
        });
      },
    );
  });

  describe('when lazyLoad prop is not set', () => {
    describe('when image prop is set to a none IMAGE_DEFAULT_BY_TYPE icon', () => {
      beforeEach(() => {
        wrapper = factory({
          image: 'image',
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the IntersectionObserver function', () => {
        expect(iOMock.observeMock).toHaveBeenCalled();
      });

      describe('when intersectionObserver is not intersecting', () => {
        it('shows the placeholder', () => {
          expect(wrapper.find({ ref: 'imageLoader' }).isVisible()).toBe(true);
        });

        it('does not show the image', () => {
          expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(false);
        });
      });

      describe('when intersectionObserver is intersecting', () => {
        beforeEach(() => {
          iOMock = intersectionObserverMock([
            {
              isIntersecting: true,
            } as never,
          ]);

          wrapper = factory({
            image: 'image',
          });
        });

        it('disconnects the IntersectionObserver function', () => {
          expect(iOMock.observerDisconnectMock).toHaveBeenCalled();
        });

        describe('when image is loading', () => {
          it('shows the placeholder', () => {
            expect(wrapper.find({ ref: 'imageLoader' }).isVisible()).toBe(true);
          });

          it('shows the image', () => {
            expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(true);
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
            expect(wrapper.find({ ref: 'imageLoader' }).isVisible()).toBe(
              false,
            );
          });

          it('shows the image', () => {
            expect(wrapper.find({ ref: 'img' }).isVisible()).toBe(true);
          });
        });

        describe('when alt prop is not set', () => {
          it('sets the correct alt attribute on the img element', () => {
            expect(wrapper.find({ ref: 'img' }).attributes('alt')).toBe(
              'Image',
            );
          });
        });

        describe('when alt prop is set', () => {
          beforeEach(() => {
            wrapper = factory({
              alt: 'Alt text for image',
              image: 'https://test.com',
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('sets the correct alt attribute on the img element', () => {
            expect(wrapper.find({ ref: 'img' }).attributes('alt')).toBe(
              'Alt text for image',
            );
          });
        });
      });

      describe('when component unmounts', () => {
        beforeEach(() => {
          wrapper.unmount();
        });

        it('disconnects the IntersectionObserver function', () => {
          expect(iOMock.disconnectMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when lazyLoad prop is set to false', () => {
    beforeEach(() => {
      wrapper = factory({
        image: 'image',
        lazyLoad: false,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not add the IntersectionObserver function', () => {
      expect(iOMock.observeMock).not.toHaveBeenCalled();
    });

    describe('when component unmounts', () => {
      beforeEach(() => {
        wrapper.unmount();
      });

      it('does not call the IntersectionObserver disconnect function', () => {
        expect(iOMock.disconnectMock).not.toHaveBeenCalled();
      });
    });
  });
});
