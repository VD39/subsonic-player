import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mount } from '@vue/test-utils';

import DropdownMenu from './DropdownMenu.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: any = {};

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');
const documentAddEventListenerSpy = vi
  .spyOn(document, 'addEventListener')
  .mockImplementation((event, cb) => {
    events[event] = cb;
  });
const documentRemoveEventListenerSpy = vi.spyOn(
  document,
  'removeEventListener',
);

function factory(props = {}) {
  return mount(DropdownMenu, {
    attachTo: document.body,
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('DropdownMenu', () => {
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

  describe('when the ButtonLink component emits a click event', () => {
    beforeEach(async () => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('emits the opened event', () => {
      expect(wrapper.emitted('opened')).toEqual([[]]);
    });

    it('does not emits the closed event', () => {
      expect(wrapper.emitted('closed')).toBe(undefined);
    });

    it('adds the click event listener function', () => {
      expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
    });

    it('adds the keydown event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
    });

    describe('when dropdown height is not less than window height', () => {
      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('emits the opened event', () => {
        expect(wrapper.emitted('opened')).toEqual([[]]);
      });

      it('does not emit the closed event', () => {
        expect(wrapper.emitted('closed')).toEqual(undefined);
      });

      it('shows the dropdown element', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).exists()).toBe(true);
      });

      it('does not add the above class to dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).classes()).not.toContain(
          'above',
        );
      });
    });

    describe('when dropdown height is less than window height', () => {
      beforeEach(async () => {
        global.window.innerHeight = 10;
        Object.defineProperties(HTMLElement.prototype, {
          clientHeight: {
            configurable: true,
            get: () => 500,
          },
        });
        Element.prototype.getBoundingClientRect = vi.fn(
          () =>
            ({
              top: 5,
            }) as DOMRect,
        );

        wrapper.findComponent(ButtonLink).vm.$emit('click');
        await wrapper.vm.$nextTick();
        wrapper.findComponent(ButtonLink).vm.$emit('click');
        await wrapper.vm.$nextTick();
      });

      it('adds the above class to dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).classes()).toContain(
          'above',
        );
      });
    });

    describe('when the ButtonLink component emits a click event again', () => {
      beforeEach(async () => {
        wrapper.findComponent(ButtonLink).vm.$emit('click');
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not emit the opened event again', () => {
        expect(wrapper.emitted('opened')).toEqual([[]]);
      });

      it('emits the closed event', () => {
        expect(wrapper.emitted('closed')).toEqual([[]]);
      });

      it('removes the dropdown element', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).exists()).toBe(false);
      });
    });

    describe('when document body is clicked', () => {
      beforeEach(async () => {
        document.body.click();
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the dropdown element', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).exists()).toBe(false);
      });

      it('removes the click event listener function', () => {
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
          'click',
          expect.any(Function),
        );
      });

      it('removes the keydown event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'keydown',
          expect.any(Function),
        );
      });
    });

    describe('when dropdown element is clicked', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'dropdownRef' }).trigger('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the dropdown element', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).exists()).toBe(false);
      });
    });

    describe('when a non esc key is pressed', () => {
      beforeEach(() => {
        events.keydown({ key: 'Shift' });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not remove the the dropdown element', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).exists()).toBe(true);
      });
    });

    describe('when esc key is pressed', () => {
      beforeEach(() => {
        events.keydown({ key: 'Escape' });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the dropdown element', () => {
        expect(wrapper.find({ ref: 'dropdownRef' }).exists()).toBe(false);
      });

      it('removes the click event listener function', () => {
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
          'click',
          expect.any(Function),
        );
      });

      it('removes the keydown event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'keydown',
          expect.any(Function),
        );
      });
    });
  });
});
