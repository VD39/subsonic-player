import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { intersectionObserverMock } from '@/test/intersectionObserverMock';

import MarqueeScroll from './MarqueeScroll.vue';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

const disconnectMock = vi.fn();
const observeMock = vi.fn();

vi.spyOn(window, 'MutationObserver').mockImplementation(() => ({
  disconnect: disconnectMock,
  observe: observeMock,
  takeRecords: vi.fn(),
}));

function factory(slots = {}) {
  return mount(MarqueeScroll, {
    slots: {
      default: '<div>Sample text.</div>',
      ...slots,
    },
  });
}

describe('MarqueeScroll', () => {
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

  it('adds the MutationObserver function', () => {
    expect(observeMock).toHaveBeenCalled();
  });

  describe('when intersectionObserver is not intersecting', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('does not add the resize event listener function', () => {
      expect(windowAddEventListenerSpy).not.toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('removes the resize event listener function', () => {
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });

  describe('when intersectionObserver is intersecting', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      intersectionObserverMock([
        {
          isIntersecting: true,
        } as never,
      ]);

      wrapper = factory();
    });

    it('adds the resize event listener function', () => {
      expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('does not remove the resize event listener function', () => {
      expect(windowRemoveEventListenerSpy).not.toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    describe('when marquee scroll clientWidth is 0', () => {
      beforeEach(() => {
        const marqueeScroll = wrapper.find({ ref: 'marqueeScrollRef' });

        Object.defineProperty(marqueeScroll.element, 'clientWidth', {
          value: 0,
        });

        global.dispatchEvent(new CustomEvent('resize'));
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not clone the slot content', () => {
        expect(wrapper.find('[data-test-id="cloned-item"]').exists()).toBe(
          false,
        );
      });

      it('does not add the animating class to wrapper element', () => {
        expect(wrapper.classes('animating')).toBe(false);
      });

      it('sets the correct styles to wrapper element', () => {
        expect(
          wrapper.find({ ref: 'marqueeScrollRef' }).attributes('style'),
        ).toBe(undefined);
      });
    });

    describe.each([
      ['less than', 199, false, undefined],
      ['equal to', 200, true, '--animation-duration: 6000ms;'],
      ['greater than', 201, true, '--animation-duration: 6000ms;'],
    ])(
      'when marqueeContent element clientWidth is %s the marqueeScroll element clientWidth',
      (_text, contentClientWidth, clonesSlot, style) => {
        beforeEach(() => {
          const marqueeScroll = wrapper.find({ ref: 'marqueeScrollRef' });
          const marqueeContent = wrapper.find({ ref: 'marqueeContentRef' });

          Object.defineProperty(marqueeScroll.element, 'clientWidth', {
            value: 200,
          });

          Object.defineProperty(marqueeContent.element, 'clientWidth', {
            value: contentClientWidth,
          });

          global.dispatchEvent(new CustomEvent('resize'));
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it(`${clonesSlot ? 'clones' : 'does not clone'} the slot content`, () => {
          expect(wrapper.find('[data-test-id="cloned-item"]').exists()).toBe(
            clonesSlot,
          );
        });

        it(`${clonesSlot ? 'adds' : 'does not add'} the animating class to wrapper element`, () => {
          expect(wrapper.classes('animating')).toBe(clonesSlot);
        });

        it('sets the correct styles to wrapper element', () => {
          expect(
            wrapper.find({ ref: 'marqueeScrollRef' }).attributes('style'),
          ).toBe(style);
        });
      },
    );

    describe('when events are triggered on wrapper', () => {
      beforeEach(() => {
        const marqueeScroll = wrapper.find({ ref: 'marqueeScrollRef' });
        const marqueeContent = wrapper.find({ ref: 'marqueeContentRef' });

        Object.defineProperty(marqueeScroll.element, 'clientWidth', {
          value: 200,
        });

        Object.defineProperty(marqueeContent.element, 'clientWidth', {
          value: 201,
        });

        global.dispatchEvent(new CustomEvent('resize'));
      });

      describe('when the mouseover is triggered on wrapper', () => {
        beforeEach(() => {
          wrapper.find({ ref: 'marqueeScrollRef' }).trigger('mouseover');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('removes the inert attribute', () => {
          expect(
            wrapper.find('[data-test-id="cloned-item"]').attributes('inert'),
          ).not.toBeDefined();
        });
      });

      describe('when the touchstart is triggered on wrapper', () => {
        beforeEach(() => {
          wrapper.find({ ref: 'marqueeScrollRef' }).trigger('touchstart');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('removes the inert attribute', () => {
          expect(
            wrapper.find('[data-test-id="cloned-item"]').attributes('inert'),
          ).not.toBeDefined();
        });
      });

      describe('when the mouseout is triggered on wrapper', () => {
        beforeEach(() => {
          wrapper.find({ ref: 'marqueeScrollRef' }).trigger('mouseout');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('adds the inert attribute', () => {
          expect(
            wrapper.find('[data-test-id="cloned-item"]').attributes('inert'),
          ).toBeDefined();
        });
      });

      describe('when the touchend is triggered on wrapper', () => {
        beforeEach(() => {
          wrapper.find({ ref: 'marqueeScrollRef' }).trigger('touchend');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('adds the inert attribute', () => {
          expect(
            wrapper.find('[data-test-id="cloned-item"]').attributes('inert'),
          ).toBeDefined();
        });
      });
    });
  });

  describe('when component unmounts', () => {
    beforeEach(() => {
      wrapper.unmount();
    });

    it('removes the resize event listener function', () => {
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('disconnects the MutationObserver function', () => {
      expect(disconnectMock).toHaveBeenCalled();
    });

    it('disconnects the IntersectionObserver function', () => {
      expect(iOMock.disconnectMock).toHaveBeenCalled();
    });
  });
});
