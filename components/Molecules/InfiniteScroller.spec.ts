import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InfiniteScroller from './InfiniteScroller.vue';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

const loadingMock = ref(false);
const hasMoreMock = ref(false);

mockNuxtImport('useInfinityLoading', () => () => ({
  hasMore: hasMoreMock,
  loading: loadingMock,
}));

function factory(props = {}) {
  return mount(InfiniteScroller, {
    attachTo: document.body,
    props: {
      ...props,
    },
  });
}

describe('InfiniteScroller', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emits the loadMore event', () => {
    expect(wrapper.emitted('loadMore')).toEqual([[]]);
  });

  it('adds the scroll event listener function', () => {
    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });

  describe('when hasMore value is false', () => {
    it('does not show the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(false);
    });

    it('shows the no more content message element', () => {
      expect(wrapper.find({ ref: 'message' }).exists()).toBe(true);
    });
  });

  describe('when hasMore value is true', () => {
    beforeEach(() => {
      hasMoreMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(true);
    });

    it('does not show the no more content message element', () => {
      expect(wrapper.find({ ref: 'message' }).exists()).toBe(false);
    });

    describe('when loading value is false', () => {
      it('sets the correct title value', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          'Load more',
        );
      });
    });

    describe('when loading value is true', () => {
      beforeEach(() => {
        loadingMock.value = true;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct title value', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          'Loading data',
        );
      });
    });

    describe('when ButtonLink component emits a click event', () => {
      beforeEach(async () => {
        await wrapper.findComponent(ButtonLink).trigger('click');
      });

      it('calls the loadMore event', () => {
        expect(wrapper.emitted('loadMore')).toEqual([[]]);
      });
    });

    describe('when scroll is called', () => {
      beforeEach(() => {
        global.window.innerHeight = 500;
        Element.prototype.getBoundingClientRect = vi.fn(
          () =>
            ({
              bottom: 500,
            }) as DOMRect,
        );
      });

      describe('when loading value is true', () => {
        it('does not emit the loadMore event', () => {
          expect(wrapper.emitted('loadMore')).toEqual([[]]);
        });
      });

      describe('when loading value is false', () => {
        beforeEach(() => {
          loadingMock.value = false;
          global.dispatchEvent(new CustomEvent('scroll'));
        });

        describe('when innerHeight is less than container getBoundingClientRect bottom', () => {
          beforeEach(() => {
            global.dispatchEvent(new CustomEvent('scroll'));
          });

          it('does not emit the loadMore event', () => {
            expect(wrapper.emitted('loadMore')).toEqual([[]]);
          });
        });

        describe('when innerHeight is greater than container getBoundingClientRect bottom', () => {
          beforeEach(() => {
            global.window.innerHeight = 600;
            global.dispatchEvent(new CustomEvent('scroll'));
          });

          it('emits the loadMore event', () => {
            expect(wrapper.emitted('loadMore')).toEqual([[], []]);
          });
        });
      });
    });

    describe('when component unmounts', () => {
      beforeEach(() => {
        wrapper.unmount();
      });

      it('removes the scroll event listeners function', () => {
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
        );
      });
    });
  });
});
