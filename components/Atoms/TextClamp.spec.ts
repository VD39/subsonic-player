import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import TextClamp from './TextClamp.vue';

const TEXT_TO_CLAMP =
  'This is a long test text that will definitely exceed the max lines set by the component.';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

function factory(props = {}) {
  return mount(TextClamp, {
    attachTo: document.body,
    props: {
      maxLines: 2,
      text: TEXT_TO_CLAMP,
      ...props,
    },
  });
}

describe('TextClamp', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
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

  it('sets the correct style attribute on the clamp element', () => {
    expect(wrapper.find({ ref: 'clamp' }).attributes('style')).toBe(
      '--truncate-line-clamp: 2;',
    );
  });

  describe('when text fits within the maxLines', () => {
    it('does not show the read more button element', () => {
      expect(wrapper.find({ ref: 'readMore' }).exists()).toBe(false);
    });

    it('renders the correct text', () => {
      expect(wrapper.find({ ref: 'textRef' }).text()).toBe(TEXT_TO_CLAMP);
    });
  });

  describe('when text does not fit within the maxLines', () => {
    beforeEach(async () => {
      HTMLElement.prototype.getClientRects = vi
        .fn()
        .mockImplementationOnce(
          () =>
            ({
              length: 3,
            }) as DOMRectList,
        )
        .mockImplementationOnce(
          () =>
            ({
              length: 2.5,
            }) as DOMRectList,
        )
        .mockImplementationOnce(
          () =>
            ({
              length: 2.5,
            }) as DOMRectList,
        )
        .mockImplementation(
          () =>
            ({
              length: 2,
            }) as DOMRectList,
        );

      wrapper = factory();
      await nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the read more button element', () => {
      expect(wrapper.find({ ref: 'readMore' }).exists()).toBe(true);
    });

    it('renders the correct text', () => {
      expect(wrapper.find({ ref: 'textRef' }).text()).toBe(
        `This is a long test text that will definitely exceed the max lines...`,
      );
    });

    describe('when the read more button is clicked', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'readMore' }).trigger('click');
      });

      it('emits the more event', () => {
        expect(wrapper.emitted('more')).toEqual([[]]);
      });
    });
  });

  describe('when the window change size is called', () => {
    describe('when text fits within the maxLines', () => {
      beforeEach(() => {
        HTMLElement.prototype.getClientRects = vi.fn().mockImplementation(
          () =>
            ({
              length: 1,
            }) as DOMRectList,
        );
        global.dispatchEvent(new CustomEvent('resize'));
      });

      it('does not show the read more button element', () => {
        expect(wrapper.find({ ref: 'readMore' }).exists()).toBe(false);
      });

      it('renders the correct text', () => {
        expect(wrapper.find({ ref: 'textRef' }).text()).toBe(TEXT_TO_CLAMP);
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
  });
});
