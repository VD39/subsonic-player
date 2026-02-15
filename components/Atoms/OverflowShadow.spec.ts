import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { windowEventListenerMock } from '../../test/eventListenersMock';
import OverflowShadow from './OverflowShadow.vue';

const { windowAddEventListenerSpy, windowRemoveEventListenerSpy } =
  windowEventListenerMock();

function factory(slots = {}) {
  return mount(OverflowShadow, {
    slots: {
      default: 'Default slot content.',
      ...slots,
    },
  });
}

describe('OverflowShadow', () => {
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

  describe('when content is less than wrapper element', () => {
    it('does not add the start class', () => {
      expect(wrapper.classes()).not.toContain('start');
    });

    it('does not add the end class', () => {
      expect(wrapper.classes()).not.toContain('end');
    });
  });

  describe('when content is greater than wrapper element', () => {
    beforeEach(() => {
      const container = wrapper.find({ ref: 'containerRef' });

      Object.defineProperty(container.element, 'offsetWidth', {
        value: 600,
      });

      Object.defineProperty(container.element, 'scrollWidth', {
        value: 1000,
      });

      globalThis.dispatchEvent(new CustomEvent('resize'));
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the end class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('end');
    });

    describe('when content is scrolled', () => {
      describe('when content is scrolled before end of wrapper width', () => {
        beforeEach(async () => {
          const container = wrapper.find({ ref: 'containerRef' });

          Object.defineProperty(container.element, 'scrollLeft', {
            value: 20,
          });

          await container.trigger('scroll');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('adds the start class to the wrapper element', () => {
          expect(wrapper.classes()).toContain('start');
        });

        it('keeps the end class on the wrapper element', () => {
          expect(wrapper.classes()).toContain('end');
        });
      });

      describe('when content is scrolled to end of wrapper width', () => {
        beforeEach(async () => {
          const container = wrapper.find({ ref: 'containerRef' });

          Object.defineProperty(container.element, 'scrollLeft', {
            value: 401,
          });

          await container.trigger('scroll');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('keeps the start class on the wrapper element', () => {
          expect(wrapper.classes()).toContain('start');
        });

        it('removes the end class from the wrapper element', () => {
          expect(wrapper.classes()).not.toContain('end');
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
  });
});
