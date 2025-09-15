import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { intersectionObserverMock } from '@/test/intersectionObserverMock';

import LazyLoadContent from './LazyLoadContent.vue';

function factory(props = {}) {
  return mount(LazyLoadContent, {
    attachTo: document.body,
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('LazyLoadContent', () => {
  let wrapper: VueWrapper;
  let iOMock: ReturnType<typeof intersectionObserverMock>;

  beforeEach(() => {
    iOMock = intersectionObserverMock();
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('adds the IntersectionObserver function', () => {
    expect(iOMock.observeMock).toHaveBeenCalled();
  });

  describe('when intersectionObserver is not intersecting', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('shows the loading data element', () => {
      expect(wrapper.find({ ref: 'loading' }).exists()).toBe(true);
    });

    it('does not show the slot content', () => {
      expect(wrapper.text()).not.toContain('Default slot content.');
    });

    it('does not disconnects the IntersectionObserver function', () => {
      expect(iOMock.observerDisconnectMock).not.toHaveBeenCalled();
    });
  });

  describe('when intersectionObserver is intersecting', () => {
    beforeEach(() => {
      iOMock = intersectionObserverMock([
        {
          isIntersecting: true,
        } as never,
      ]);

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the loading data element', () => {
      expect(wrapper.find({ ref: 'loading' }).exists()).toBe(false);
    });

    it('shows the slot content', () => {
      expect(wrapper.text()).toContain('Default slot content.');
    });

    it('disconnects the IntersectionObserver function', () => {
      expect(iOMock.observerDisconnectMock).toHaveBeenCalled();
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
