import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import InputRange from './InputRange.vue';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');
const documentAddEventListenerSpy = vi.spyOn(document, 'addEventListener');
const documentRemoveEventListenerSpy = vi.spyOn(
  document,
  'removeEventListener',
);
window.HTMLElement.prototype.getBoundingClientRect = () =>
  ({
    left: 0,
    width: 100,
  }) as DOMRect;

function factory(props = {}, slots = {}) {
  return mount(InputRange, {
    props: {
      max: 10,
      min: 0,
      modelValue: 2.5,
      ...props,
    },
    slots: {
      ...slots,
    },
    attachTo: document.body,
  });
}

describe('InputRange', () => {
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

  describe('when model value updates', () => {
    beforeEach(async () => {
      await wrapper.setProps({ modelValue: 5 });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct progress bar style value', () => {
      expect(wrapper.find({ ref: 'progressBar' }).attributes('style')).toBe(
        'width: 50px;',
      );
    });
  });

  describe('when bufferLength prop is not set', () => {
    it('does not show the bufferBar', () => {
      expect(wrapper.find({ ref: 'bufferBar' }).exists()).toBe(false);
    });
  });

  describe('when bufferLength prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        buffer: 5,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the buffer', () => {
      expect(wrapper.find({ ref: 'bufferBar' }).exists()).toBe(true);
    });

    it('sets the correct buffer bar style value', () => {
      expect(wrapper.find({ ref: 'bufferBar' }).attributes('style')).toBe(
        'width: 50px;',
      );
    });

    describe('when buffer duration updates', () => {
      beforeEach(async () => {
        await wrapper.setProps({ buffer: 7.5 });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct buffer bar style value', () => {
        expect(wrapper.find({ ref: 'bufferBar' }).attributes('style')).toBe(
          'width: 75px;',
        );
      });
    });
  });

  describe('when hideThumb prop is not set', () => {
    it('shows the thumb', () => {
      expect(wrapper.find({ ref: 'thumbRef' }).exists()).toBe(true);
    });

    it('sets the correct thumb style value', () => {
      expect(wrapper.find({ ref: 'thumbRef' }).attributes('style')).toBe(
        'left: 19px;',
      );
    });
  });

  describe('when hideThumb prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        hideThumb: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the thumb', () => {
      expect(wrapper.find({ ref: 'thumbRef' }).exists()).toBe(false);
    });
  });

  describe('when the mousedown on slider is called', () => {
    beforeEach(() => {
      wrapper.find({ ref: 'sliderRef' }).trigger('mousedown', {
        pageX: 60,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the seeking class to wrapper', () => {
      expect(wrapper.classes()).toContain('seeking');
    });

    it('adds the mouseup event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
      );
    });

    it('adds the mousemove event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
    });

    describe('when slider mousemove is called', () => {
      beforeEach(() => {
        wrapper.find({ ref: 'sliderRef' }).trigger('mousemove', {
          pageX: 30,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct progress bar style value', () => {
        expect(wrapper.find({ ref: 'progressBar' }).attributes('style')).toBe(
          'width: 30px;',
        );
      });

      it('sets the correct thumb style value', () => {
        expect(wrapper.find({ ref: 'thumbRef' }).attributes('style')).toBe(
          'left: 24px;',
        );
      });
    });

    describe('when the mouseup is called', () => {
      beforeEach(() => {
        document.dispatchEvent(new MouseEvent('mouseup'));
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the seeking class from the wrapper', () => {
        expect(wrapper.classes()).not.toContain('seeking');
      });

      it('removes the mouseup event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'mouseup',
          expect.any(Function),
        );
      });

      it('removes the mousemove event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'mousemove',
          expect.any(Function),
        );
      });
    });

    describe('when delay props is not set', () => {
      it('emits the update:modelValue value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[6]]);
      });

      it('emits the change value', () => {
        expect(wrapper.emitted('change')).toEqual([[6]]);
      });
    });

    describe('when delay props is set to true', () => {
      beforeEach(() => {
        wrapper = factory({
          delay: true,
        });

        wrapper.find({ ref: 'sliderRef' }).trigger('mousedown', {
          pageX: 60,
        });
      });

      it('emits the update:modelValue value', () => {
        expect(wrapper.emitted('update:modelValue')).toBe(undefined);
      });

      it('emits the change value', () => {
        expect(wrapper.emitted('change')).toBe(undefined);
      });
    });
  });

  describe('when default slot is not set', () => {
    it('does not show the default slot content', () => {
      expect(wrapper.find({ ref: 'defaultSlot' }).exists()).toBe(false);
    });
  });

  describe('when default slot is set', () => {
    beforeEach(() => {
      wrapper = factory(undefined, {
        default: '<p>{{ pendingValue }}</p>',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the default slot content', () => {
      expect(wrapper.find({ ref: 'defaultSlot' }).exists()).toBe(true);
    });

    describe('when the mousemove on slider is called', () => {
      describe('when the mouseover on slider is not called before', () => {
        beforeEach(() => {
          wrapper.find({ ref: 'sliderRef' }).trigger('mousemove', {
            pageX: 80,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not update the pending value', () => {
          expect(wrapper.find({ ref: 'defaultSlot' }).attributes('style')).toBe(
            'left: 25px;',
          );
        });
      });

      describe('when the mouseover on slider is called before', () => {
        beforeEach(() => {
          const slider = wrapper.find({ ref: 'sliderRef' });
          slider.trigger('mouseover');
          slider.trigger('mousemove', {
            pageX: 80,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('updates the pending value', () => {
          expect(wrapper.find({ ref: 'defaultSlot' }).attributes('style')).toBe(
            'left: 80px;',
          );
        });
      });
    });
  });

  describe('when the window change size is called', () => {
    beforeEach(() => {
      window.HTMLElement.prototype.getBoundingClientRect = () =>
        ({
          left: 0,
          width: 200,
        }) as DOMRect;
      global.dispatchEvent(new CustomEvent('resize'));
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct progress bar style value', () => {
      expect(wrapper.find({ ref: 'progressBar' }).attributes('style')).toBe(
        'width: 50px;',
      );
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
