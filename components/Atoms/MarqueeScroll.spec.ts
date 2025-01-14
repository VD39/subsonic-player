import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MarqueeScroll from './MarqueeScroll.vue';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

const disconnectMock = vi.fn();

const windowMutationObserverSpy = vi
  .spyOn(window, 'MutationObserver')
  .mockImplementation(() => ({
    disconnect: disconnectMock,
    observe: vi.fn(),
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

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('adds the resize event listener function', () => {
    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });

  it('adds the MutationObserver function', () => {
    expect(windowMutationObserverSpy).toHaveBeenCalled();
  });

  describe.each([
    ['less than', 199, false],
    ['equal to', 200, true],
    ['greater than', 201, true],
  ])(
    'when marqueeContent element clientWidth is %s the marqueeScroll element clientWidth',
    (_text, contentClientWidth, clonesSlot) => {
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

      it('adds the inert attribute', () => {
        expect(
          wrapper.find('[data-test-id="cloned-item"]').attributes('inert'),
        ).toBeDefined();
      });
    });

    describe('when the touchstart is triggered on wrapper', () => {
      beforeEach(() => {
        wrapper.find({ ref: 'marqueeScrollRef' }).trigger('touchstart');
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

    describe('when the mouseout is triggered on wrapper', () => {
      beforeEach(() => {
        wrapper.find({ ref: 'marqueeScrollRef' }).trigger('mouseout');
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

    describe('when the touchend is triggered on wrapper', () => {
      beforeEach(() => {
        wrapper.find({ ref: 'marqueeScrollRef' }).trigger('touchend');
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
  });
});
