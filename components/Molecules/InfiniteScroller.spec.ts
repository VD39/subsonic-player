import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import { intersectionObserverMock } from '@/test/intersectionObserverMock';

import InfiniteScroller from './InfiniteScroller.vue';

function factory(props = {}) {
  return mount(InfiniteScroller, {
    attachTo: document.body,
    props: {
      hasMore: true,
      loading: false,
      ...props,
    },
  });
}

describe('InfiniteScroller', () => {
  let wrapper: VueWrapper;
  let iOMock: ReturnType<typeof intersectionObserverMock>;

  beforeEach(() => {
    iOMock = intersectionObserverMock();
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('adds the IntersectionObserver function', () => {
    expect(iOMock.observeMock).toHaveBeenCalled();
  });

  describe('when hasMore prop is false', () => {
    beforeEach(() => {
      wrapper = factory({
        hasMore: false,
      });
    });

    it('does not show the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(false);
    });

    it('shows the no more content message element', () => {
      expect(wrapper.find({ ref: 'message' }).exists()).toBe(true);
    });
  });

  describe('when hasMore prop is true', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(true);
    });

    it('does not show the no more content message element', () => {
      expect(wrapper.find({ ref: 'message' }).exists()).toBe(false);
    });

    describe('when loading prop is false', () => {
      it('sets the correct title attribute value on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          'Load more',
        );
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBeUndefined();
      });
    });

    describe('when loading prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          loading: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct title attribute value on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          'Loading data',
        );
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          SpinningLoader,
        );
      });
    });

    describe('when ButtonLink component is clicked', () => {
      beforeEach(async () => {
        await wrapper.findComponent(ButtonLink).trigger('click');
      });

      it('calls the loadMore event', () => {
        expect(wrapper.emitted('loadMore')).toEqual([[]]);
      });
    });
  });

  describe('when intersectionObserver is not intersecting', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('does not call the loadMore event', () => {
      expect(wrapper.emitted('loadMore')).toEqual(undefined);
    });
  });

  describe('when intersectionObserver is intersecting', () => {
    beforeEach(() => {
      intersectionObserverMock([
        {
          isIntersecting: true,
        } as never,
      ]);
    });

    describe('when hasMore prop is false', () => {
      beforeEach(() => {
        wrapper = factory({
          hasMore: false,
        });
      });

      it('does not call the loadMore event', () => {
        expect(wrapper.emitted('loadMore')).toEqual(undefined);
      });
    });

    describe('when hasMore prop is true', () => {
      describe('when loading prop is false', () => {
        beforeEach(() => {
          wrapper = factory();
        });

        it('calls the loadMore event', () => {
          expect(wrapper.emitted('loadMore')).toEqual([[]]);
        });
      });

      describe('when loading prop is true', () => {
        beforeEach(() => {
          wrapper = factory({
            loading: true,
          });
        });

        it('does not call the loadMore event', () => {
          expect(wrapper.emitted('loadMore')).toEqual(undefined);
        });
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
