import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MarqueeScroll from './MarqueeScroll.vue';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

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
  });
});
