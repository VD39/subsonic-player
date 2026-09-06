import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { abortControllerMock } from '@/test/abortControllerMock';
import {
  documentEventListenerMock,
  windowEventListenerMock,
} from '@/test/eventListenersMock';

import InputRange from './InputRange.vue';

vi.useFakeTimers();

const { windowAddEventListenerSpy, windowRemoveEventListenerSpy } =
  windowEventListenerMock();
const { documentAddEventListenerSpy } = documentEventListenerMock();
const { abortControllerConstructorMock, abortMock, signalMock } =
  abortControllerMock();
HTMLElement.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 100, 0);

let onKeydownMock: ((event: KeyboardEvent) => unknown) | undefined;

function factory(props = {}, slots = {}) {
  return mount(InputRange, {
    attachTo: document.body,
    props: {
      max: 10,
      min: 0,
      modelValue: 2.5,
      onKeydown: onKeydownMock,
      ...props,
    },
    slots: {
      ...slots,
    },
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

  it('sets the correct role attribute on the wrapper element', () => {
    expect(wrapper.attributes('role')).toBe('slider');
  });

  it('sets the correct aria-valuemin attribute on the wrapper element', () => {
    expect(wrapper.attributes('aria-valuemin')).toBe('0');
  });

  it('sets the correct aria-valuemax attribute on the wrapper element', () => {
    expect(wrapper.attributes('aria-valuemax')).toBe('10');
  });

  it('sets the correct aria-valuenow attribute on the wrapper element', () => {
    expect(wrapper.attributes('aria-valuenow')).toBe('2.5');
  });

  it('sets the correct tabindex attribute on the wrapper element', () => {
    expect(wrapper.attributes('tabindex')).toBe('0');
  });

  describe('when the modelValue prop updates', () => {
    beforeEach(async () => {
      await wrapper.setProps({ modelValue: 5 });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the progress bar element', () => {
      expect(
        wrapper.find({ ref: 'progressBar' }).attributes('style'),
      ).toContain('width: 50px;');
    });
  });

  describe('when the buffer prop is not set', () => {
    it('does not show the buffer bar element', () => {
      expect(wrapper.find({ ref: 'bufferBar' }).exists()).toBe(false);
    });
  });

  describe('when the buffer prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        buffer: 5,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the buffer bar element', () => {
      expect(wrapper.find({ ref: 'bufferBar' }).exists()).toBe(true);
    });

    it('sets the correct style attribute on the buffer bar element', () => {
      expect(wrapper.find({ ref: 'bufferBar' }).attributes('style')).toContain(
        'width: 50px;',
      );
    });

    describe('when the buffer prop updates', () => {
      beforeEach(async () => {
        await wrapper.setProps({ buffer: 7.5 });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct style attribute on the buffer bar element', () => {
        expect(
          wrapper.find({ ref: 'bufferBar' }).attributes('style'),
        ).toContain('width: 75px;');
      });
    });
  });

  describe('when the max prop is greater than 0', () => {
    it('does not add the standard class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('standard');
    });

    it('shows the thumb element', () => {
      expect(wrapper.find({ ref: 'thumb' }).exists()).toBe(true);
    });

    it('sets the correct style attribute on the progress bar element', () => {
      expect(
        wrapper.find({ ref: 'progressBar' }).attributes('style'),
      ).toContain('width: 25px;');
    });
  });

  describe('when the max prop is equal to 0', () => {
    beforeEach(() => {
      wrapper = factory({
        max: 0,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the standard class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('standard');
    });

    it('does not show the thumb element', () => {
      expect(wrapper.find({ ref: 'thumb' }).exists()).toBe(false);
    });

    it('does not add the tabindex attribute to the wrapper element', () => {
      expect(wrapper.attributes('tabindex')).toBeUndefined();
    });

    it('sets the correct style attribute on the progress bar element', () => {
      expect(
        wrapper.find({ ref: 'progressBar' }).attributes('style'),
      ).toContain('width: 100px;');
    });
  });

  describe('when the min prop is set to a value greater than 0', () => {
    beforeEach(() => {
      wrapper = factory({
        max: 12,
        min: 3,
        modelValue: 3,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the progress bar element', () => {
      expect(
        wrapper.find({ ref: 'progressBar' }).attributes('style'),
      ).toContain('width: 0px;');
    });

    describe('when the modelValue changes to a middle value', () => {
      beforeEach(async () => {
        await wrapper.setProps({ modelValue: 7.5 });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct style attribute on the progress bar element', () => {
        expect(
          wrapper.find({ ref: 'progressBar' }).attributes('style'),
        ).toContain('width: 50px;');
      });
    });

    describe('when the modelValue changes to the minimum value', () => {
      beforeEach(async () => {
        await wrapper.setProps({ modelValue: 3 });
      });

      it('sets the correct style attribute on the progress bar element', () => {
        expect(
          wrapper.find({ ref: 'progressBar' }).attributes('style'),
        ).toContain('width: 0px;');
      });
    });

    describe('when the mousedown is triggered on the slider', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'sliderRef' }).trigger('mousedown', {
          pageX: 50,
        });
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[7.5]]);
      });
    });
  });

  describe('when the height prop is not set', () => {
    it('sets the correct style attribute on the wrapper element', () => {
      expect(wrapper.attributes('style')).toContain(
        '--input-slider-height: 6px;',
      );
    });
  });

  describe('when the height prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        height: 10,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the wrapper element', () => {
      expect(wrapper.attributes('style')).toContain(
        '--input-slider-height: 10px;',
      );
    });
  });

  describe('when the hideThumb prop is not set', () => {
    it('shows the thumb element', () => {
      expect(wrapper.find({ ref: 'thumb' }).exists()).toBe(true);
    });
  });

  describe('when the hideThumb prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        hideThumb: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the thumb element', () => {
      expect(wrapper.find({ ref: 'thumb' }).exists()).toBe(false);
    });
  });

  describe('when the disabled prop is not set', () => {
    it('does not add the disabled class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('disabled');
    });

    it('sets the correct aria-disabled attribute on the wrapper element', () => {
      expect(wrapper.attributes('aria-disabled')).toBe('false');
    });
  });

  describe('when the disabled prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        disabled: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the disabled class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('disabled');
    });

    it('sets the correct aria-disabled attribute on the wrapper element', () => {
      expect(wrapper.attributes('aria-disabled')).toBe('true');
    });

    it('does not add the tabindex attribute to the wrapper element', () => {
      expect(wrapper.attributes('tabindex')).toBeUndefined();
    });

    describe('when an arrow key is pressed on the wrapper element', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', {
          key: 'ArrowRight',
        });
      });

      it('does not emit the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      });

      it('does not emit the change event', () => {
        expect(wrapper.emitted('change')).toBeUndefined();
      });
    });

    describe('when the mousedown is triggered on the slider', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'sliderRef' }).trigger('mousedown', {
          pageX: 60,
        });
      });

      it('does not add the seeking class to the wrapper element', () => {
        expect(wrapper.classes()).not.toContain('seeking');
      });

      it('does not call the AbortController constructor', () => {
        expect(abortControllerConstructorMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the default slot is not set', () => {
    it('does not show the tooltip element', () => {
      expect(wrapper.find({ ref: 'tooltip' }).exists()).toBe(false);
    });
  });

  describe('when the default slot is set', () => {
    describe('when the max prop is equal to 0', () => {
      beforeEach(() => {
        wrapper = factory(
          {
            max: 0,
          },
          {
            default: '<p>{{ pendingValue }}</p>',
          },
        );
      });

      it('does not show the tooltip element', () => {
        expect(wrapper.find({ ref: 'tooltip' }).exists()).toBe(false);
      });
    });

    describe('when the hideThumb prop is set to true', () => {
      beforeEach(() => {
        wrapper = factory(
          {
            hideThumb: true,
          },
          {
            default: '<p>{{ pendingValue }}</p>',
          },
        );
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the tooltip element', () => {
        expect(wrapper.find({ ref: 'tooltip' }).exists()).toBe(false);
      });
    });

    describe('when the max prop is greater than 0', () => {
      beforeEach(() => {
        wrapper = factory(
          {},
          {
            default: '<p>{{ pendingValue }}</p>',
          },
        );
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the tooltip element', () => {
        expect(wrapper.find({ ref: 'tooltip' }).exists()).toBe(true);
      });

      describe('when the mousemove is triggered on the slider', () => {
        describe('when the mouseover on slider is not called before', () => {
          beforeEach(async () => {
            await wrapper.find({ ref: 'sliderRef' }).trigger('mousemove', {
              pageX: 80,
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('sets the correct style attribute on the tooltip element', () => {
            expect(
              wrapper.find({ ref: 'tooltip' }).attributes('style'),
            ).toContain('left: 25px;');
          });
        });

        describe('when the mouseover on slider is called before', () => {
          beforeEach(async () => {
            const slider = wrapper.find({ ref: 'sliderRef' });

            await slider.trigger('mouseover');
            await slider.trigger('mousemove', {
              pageX: 80,
            });
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('sets the correct style attribute on the tooltip element', () => {
            expect(
              wrapper.find({ ref: 'tooltip' }).attributes('style'),
            ).toContain('left: 80px;');
          });
        });
      });
    });
  });

  describe('when the mousedown is triggered on the slider', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'sliderRef' }).trigger('mousedown', {
        pageX: 60,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the seeking class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('seeking');
    });

    it('adds the abort event listener functions', () => {
      expect(abortControllerConstructorMock).toHaveBeenCalled();
    });

    it('adds the mouseup event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    it('adds the mousemove event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    it('adds the touchend event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
        {
          passive: true,
          signal: signalMock,
        },
      );
    });

    it('adds the touchmove event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
        {
          passive: true,
          signal: signalMock,
        },
      );
    });

    describe('when the mousemove is triggered on the slider', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'sliderRef' }).trigger('mousemove', {
          pageX: 30,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct style attribute on the progress bar element', () => {
        expect(
          wrapper.find({ ref: 'progressBar' }).attributes('style'),
        ).toContain('width: 30px;');
      });

      it('sets the correct style attribute on the thumb element', () => {
        expect(wrapper.find({ ref: 'thumb' }).attributes('style')).toContain(
          'left: 24px;',
        );
      });
    });

    describe('when the mouseup is triggered on document', () => {
      beforeEach(() => {
        document.dispatchEvent(new MouseEvent('mouseup'));
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the seeking class from the wrapper element', () => {
        expect(wrapper.classes()).not.toContain('seeking');
      });

      it('calls the abort function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when the commitOnRelease prop is not set', () => {
      it('emits the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[6]]);
      });

      it('emits the change event', () => {
        expect(wrapper.emitted('change')).toEqual([[6]]);
      });
    });

    describe('when the commitOnRelease prop is set to true', () => {
      beforeEach(async () => {
        wrapper = factory({
          commitOnRelease: true,
        });

        await wrapper.find({ ref: 'sliderRef' }).trigger('mousedown', {
          pageX: 60,
        });
      });

      it('does not emit the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      });

      it('does not emit the change event', () => {
        expect(wrapper.emitted('change')).toBeUndefined();
      });
    });
  });

  describe('when the touchstart is triggered on the slider', () => {
    describe('when touches is not an empty array', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'sliderRef' }).trigger('touchstart', {
          touches: [{ pageX: 60 } as Touch],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the seeking class to the wrapper element', () => {
        expect(wrapper.classes()).toContain('seeking');
      });

      it('adds the abort event listener functions', () => {
        expect(abortControllerConstructorMock).toHaveBeenCalled();
      });

      it('adds the mouseup event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'mouseup',
          expect.any(Function),
          {
            signal: signalMock,
          },
        );
      });

      it('adds the mousemove event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'mousemove',
          expect.any(Function),
          {
            signal: signalMock,
          },
        );
      });

      it('adds the touchend event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'touchend',
          expect.any(Function),
          {
            passive: true,
            signal: signalMock,
          },
        );
      });

      it('adds the touchmove event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'touchmove',
          expect.any(Function),
          {
            passive: true,
            signal: signalMock,
          },
        );
      });

      describe('when the mousemove is triggered on the slider', () => {
        beforeEach(async () => {
          await wrapper.find({ ref: 'sliderRef' }).trigger('mousemove', {
            pageX: 30,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('sets the correct style attribute on the progress bar element', () => {
          expect(
            wrapper.find({ ref: 'progressBar' }).attributes('style'),
          ).toContain('width: 30px;');
        });

        it('sets the correct style attribute on the thumb element', () => {
          expect(wrapper.find({ ref: 'thumb' }).attributes('style')).toContain(
            'left: 24px;',
          );
        });
      });

      describe('when the mouseup is triggered on document', () => {
        beforeEach(() => {
          document.dispatchEvent(new MouseEvent('mouseup'));
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('removes the seeking class from the wrapper element', () => {
          expect(wrapper.classes()).not.toContain('seeking');
        });

        it('calls the abort function', () => {
          expect(abortMock).toHaveBeenCalled();
        });
      });

      describe('when the commitOnRelease prop is not set', () => {
        it('emits the update:modelValue event', () => {
          expect(wrapper.emitted('update:modelValue')).toEqual([[6]]);
        });

        it('emits the change event', () => {
          expect(wrapper.emitted('change')).toEqual([[6]]);
        });
      });

      describe('when the commitOnRelease prop is set to true', () => {
        beforeEach(async () => {
          wrapper = factory({
            commitOnRelease: true,
          });

          await wrapper.find({ ref: 'sliderRef' }).trigger('touchstart', {
            touches: [{ pageX: 60 } as Touch],
          });
        });

        it('does not emit the update:modelValue event', () => {
          expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });

        it('does not emit the change event', () => {
          expect(wrapper.emitted('change')).toBeUndefined();
        });
      });
    });

    describe('when touches is an empty array and changedTouches is not an empty array', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'sliderRef' }).trigger('touchstart', {
          changedTouches: [{ pageX: 60 } as Touch],
          touches: [],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the seeking class to the wrapper element', () => {
        expect(wrapper.classes()).toContain('seeking');
      });

      it('adds the abort event listener functions', () => {
        expect(abortControllerConstructorMock).toHaveBeenCalled();
      });

      it('adds the mouseup event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'mouseup',
          expect.any(Function),
          {
            signal: signalMock,
          },
        );
      });

      it('adds the mousemove event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'mousemove',
          expect.any(Function),
          {
            signal: signalMock,
          },
        );
      });

      it('adds the touchend event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'touchend',
          expect.any(Function),
          {
            passive: true,
            signal: signalMock,
          },
        );
      });

      it('adds the touchmove event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'touchmove',
          expect.any(Function),
          {
            passive: true,
            signal: signalMock,
          },
        );
      });

      describe('when the mousemove is triggered on the slider', () => {
        beforeEach(async () => {
          await wrapper.find({ ref: 'sliderRef' }).trigger('mousemove', {
            pageX: 30,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('sets the correct style attribute on the progress bar element', () => {
          expect(
            wrapper.find({ ref: 'progressBar' }).attributes('style'),
          ).toContain('width: 30px;');
        });

        it('sets the correct style attribute on the thumb element', () => {
          expect(wrapper.find({ ref: 'thumb' }).attributes('style')).toContain(
            'left: 24px;',
          );
        });
      });

      describe('when the mouseup is triggered on document', () => {
        beforeEach(() => {
          document.dispatchEvent(new MouseEvent('mouseup'));
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('removes the seeking class from the wrapper element', () => {
          expect(wrapper.classes()).not.toContain('seeking');
        });

        it('calls the abort function', () => {
          expect(abortMock).toHaveBeenCalled();
        });
      });

      describe('when the commitOnRelease prop is not set', () => {
        it('emits the update:modelValue event', () => {
          expect(wrapper.emitted('update:modelValue')).toEqual([[6]]);
        });

        it('emits the change event', () => {
          expect(wrapper.emitted('change')).toEqual([[6]]);
        });
      });

      describe('when the commitOnRelease prop is set to true', () => {
        beforeEach(async () => {
          wrapper = factory({
            commitOnRelease: true,
          });

          await wrapper.find({ ref: 'sliderRef' }).trigger('touchstart', {
            changedTouches: [{ pageX: 60 } as Touch],
            touches: [],
          });
        });

        it('does not emit the update:modelValue event', () => {
          expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });

        it('does not emit the change event', () => {
          expect(wrapper.emitted('change')).toBeUndefined();
        });
      });
    });

    describe('when touches and changedTouches are empty arrays', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'sliderRef' }).trigger('touchstart', {
          changedTouches: [],
          touches: [],
        });
      });

      it('does not emit the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      });

      it('does not emit the change event', () => {
        expect(wrapper.emitted('change')).toBeUndefined();
      });
    });
  });

  describe('when an arrow key is pressed on the wrapper element', () => {
    describe.each([
      ['ArrowRight', 2.6, 26],
      ['ArrowUp', 2.6, 26],
      ['ArrowLeft', 2.4, 24],
      ['ArrowDown', 2.4, 24],
    ])('when the %s key is pressed', (key, expected, expectedWidth) => {
      let preventDefaultMock: ReturnType<typeof vi.fn>;

      beforeEach(async () => {
        preventDefaultMock = vi.fn();

        await wrapper.trigger('keydown', {
          key,
          preventDefault: preventDefaultMock,
        });
      });

      it('calls the preventDefault function on the event', () => {
        expect(preventDefaultMock).toHaveBeenCalled();
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[expected]]);
      });

      it('emits the change event with the correct value', () => {
        expect(wrapper.emitted('change')).toEqual([[expected]]);
      });

      it('sets the correct style attribute on the progress bar element', () => {
        expect(
          wrapper.find({ ref: 'progressBar' }).attributes('style'),
        ).toContain(`width: ${expectedWidth}px;`);
      });
    });

    describe('when a non-arrow key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', {
          key: 'Enter',
        });
      });

      it('does not emit the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      });

      it('does not emit the change event', () => {
        expect(wrapper.emitted('change')).toBeUndefined();
      });
    });

    describe('when the commitOnRelease prop is set to true', () => {
      beforeEach(async () => {
        wrapper = factory({
          commitOnRelease: true,
        });

        await wrapper.trigger('keydown', {
          key: 'ArrowRight',
        });
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[2.6]]);
      });

      it('emits the change event with the correct value', () => {
        expect(wrapper.emitted('change')).toEqual([[2.6]]);
      });
    });

    describe('when the step prop is set', () => {
      beforeEach(async () => {
        wrapper = factory({
          step: 2,
        });

        await wrapper.trigger('keydown', {
          key: 'ArrowRight',
        });
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[4.5]]);
      });

      it('emits the change event with the correct value', () => {
        expect(wrapper.emitted('change')).toEqual([[4.5]]);
      });
    });

    describe('when the new value would be greater than the max value', () => {
      beforeEach(async () => {
        wrapper = factory({
          max: 4,
          step: 2,
        });

        await wrapper.trigger('keydown', {
          key: 'ArrowRight',
        });
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[4]]);
      });
    });

    describe('when the new value would be lower than the min value', () => {
      beforeEach(async () => {
        wrapper = factory({
          min: 2,
          step: 2,
        });

        await wrapper.trigger('keydown', {
          key: 'ArrowLeft',
        });
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[2]]);
      });
    });

    describe('when the onKeydown event is not attached to the component', () => {
      beforeEach(async () => {
        onKeydownMock = undefined;

        wrapper = factory();

        await wrapper.trigger('keydown', {
          key: 'ArrowRight',
        });
      });

      it('does not call the keydown listener', () => {
        expect(onKeydownMock).toBeUndefined();
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[2.6]]);
      });
    });

    describe('when the onKeydown event is attached to the component', () => {
      beforeEach(async () => {
        onKeydownMock = vi.fn();

        wrapper = factory();

        await wrapper.trigger('keydown', {
          key: 'ArrowRight',
        });
      });

      it('calls the keydown listener', () => {
        expect(onKeydownMock).toHaveBeenCalledWith(expect.any(KeyboardEvent));
      });

      it('emits the update:modelValue event with the correct value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[2.6]]);
      });

      it('emits the change event with the correct value', () => {
        expect(wrapper.emitted('change')).toEqual([[2.6]]);
      });
    });
  });

  describe('when the window change size is called', () => {
    beforeEach(() => {
      HTMLElement.prototype.getBoundingClientRect = () =>
        new DOMRect(0, 0, 200, 0);

      globalThis.dispatchEvent(new CustomEvent('resize'));
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the progress bar element', () => {
      expect(
        wrapper.find({ ref: 'progressBar' }).attributes('style'),
      ).toContain('width: 50px;');
    });
  });

  describe('when the component unmounts', () => {
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
