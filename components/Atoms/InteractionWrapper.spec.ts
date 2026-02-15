import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { shallowMount } from '@vue/test-utils';

import { classListMock } from '@/test/classListMock';

import InteractionWrapper from './InteractionWrapper.vue';

let onDragStartMock: typeof vi.fn | undefined = undefined;

vi.mock('vue', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue');

  return {
    ...vue,
    getCurrentInstance: vi.fn(() => ({
      ...vue.getCurrentInstance(),
      vnode: {
        props: {
          onDragStart: onDragStartMock,
        },
      },
    })),
  };
});

vi.useFakeTimers();

const isAnyOpenMock = ref(false);

mockNuxtImport('useDropdownMenuState', () => () => ({
  isAnyOpen: isAnyOpenMock,
}));

const closestSpy = vi.spyOn(HTMLElement.prototype, 'closest');

const { containsClassMock } = classListMock();

function factory(props = {}) {
  return shallowMount(InteractionWrapper, {
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('InteractionWrapper', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    containsClassMock.mockReturnValueOnce(false);
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the click event is triggered', () => {
    describe('when the closest target is a button', () => {
      beforeEach(async () => {
        closestSpy.mockReturnValueOnce(document.createElement('button'));
        await wrapper.trigger('click');
      });

      it('does not emit the click event', () => {
        expect(wrapper.emitted('click')).toBeUndefined();
      });
    });

    describe('when the closest target is an anchor element', () => {
      beforeEach(async () => {
        closestSpy.mockReturnValueOnce(document.createElement('a'));
        await wrapper.trigger('click');
      });

      it('does not emit the click event', () => {
        expect(wrapper.emitted('click')).toBeUndefined();
      });
    });

    describe('when isAnyOpen is true', () => {
      beforeEach(async () => {
        isAnyOpenMock.value = true;
        await wrapper.trigger('click');
      });

      it('does not emit the click event', () => {
        expect(wrapper.emitted('click')).toBeUndefined();
      });
    });

    describe(`when the closest target does contain the ${INTERACTION_LINK_CLASS} class`, () => {
      beforeEach(async () => {
        closestSpy.mockReturnValueOnce(document.createElement('a'));
        containsClassMock.mockReturnValueOnce(true);
        await wrapper.trigger('click');
      });

      it('does not emit the click event', () => {
        expect(wrapper.emitted('click')).toBeUndefined();
      });
    });

    describe('when isAnyOpen is false and the target is not an interactive element', () => {
      beforeEach(async () => {
        isAnyOpenMock.value = false;
        await wrapper.trigger('click');
      });

      it('emits the click event', () => {
        expect(wrapper.emitted('click')).toEqual([[expect.any(MouseEvent)]]);
      });
    });

    describe('when a long press is currently triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('touchstart');
        vi.advanceTimersByTime(500);
        await wrapper.trigger('click');
      });

      it('does not emit the click event', () => {
        expect(wrapper.emitted('click')).toBeUndefined();
      });

      describe('when the long press resets', () => {
        beforeEach(async () => {
          vi.advanceTimersByTime(50);
          await wrapper.trigger('click');
        });

        it('emits the click event', () => {
          expect(wrapper.emitted('click')).toEqual([[expect.any(MouseEvent)]]);
        });
      });
    });
  });

  describe('when the contextmenu event is triggered', () => {
    describe('when the target is not an interactive element', () => {
      beforeEach(async () => {
        await wrapper.trigger('contextmenu');
      });

      it('emits the contextMenu event', () => {
        expect(wrapper.emitted('contextMenu')).toEqual([
          [expect.any(MouseEvent)],
        ]);
      });
    });

    describe('when the closest target is a button', () => {
      beforeEach(async () => {
        closestSpy.mockReturnValueOnce(document.createElement('button'));
        await wrapper.trigger('contextmenu');
      });

      it('does not emit the contextMenu event', () => {
        expect(wrapper.emitted('contextMenu')).toBeUndefined();
      });
    });

    describe('when the closest target is an anchor element', () => {
      beforeEach(async () => {
        closestSpy.mockReturnValueOnce(document.createElement('a'));
        await wrapper.trigger('contextmenu');
      });

      it('does not emit the contextMenu event', () => {
        expect(wrapper.emitted('contextMenu')).toBeUndefined();
      });
    });

    describe('when the closest target does have an eventLink class', () => {
      beforeEach(async () => {
        containsClassMock.mockReturnValueOnce(true);
        await wrapper.trigger('contextmenu');
      });

      it('emits the contextMenu event', () => {
        expect(wrapper.emitted('contextMenu')).toEqual([
          [expect.any(MouseEvent)],
        ]);
      });
    });
  });

  describe('when the dragstart event is triggered', () => {
    beforeEach(async () => {
      await wrapper.trigger('dragstart');
    });

    it('emits the dragStart event', () => {
      expect(wrapper.emitted('dragStart')).toEqual([[expect.any(DragEvent)]]);
    });

    describe('when a touchstart event is already triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('touchstart');
        vi.advanceTimersByTime(499);
        await wrapper.trigger('dragstart');
      });

      it('cancels the long press and does not emit the longPress event', () => {
        vi.advanceTimersByTime(1);
        expect(wrapper.emitted('longPress')).toBeUndefined();
      });

      it('emits the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toEqual([
          [expect.any(DragEvent)],
          [expect.any(DragEvent)],
        ]);
      });
    });
  });

  describe('when the touchstart event is triggered', () => {
    describe('when the touch is ended before 500ms', () => {
      beforeEach(async () => {
        await wrapper.trigger('touchstart');
        vi.advanceTimersByTime(499);
      });

      it('does not emit the longPress event', () => {
        expect(wrapper.emitted('longPress')).toBeUndefined();
      });
    });

    describe('when 500ms has passed', () => {
      beforeEach(async () => {
        await wrapper.trigger('touchstart');
        vi.advanceTimersByTime(500);
      });

      it('emits the longPress event', () => {
        expect(wrapper.emitted('longPress')).toEqual([
          [expect.any(TouchEvent)],
        ]);
      });
    });

    describe('when the touchmove event is triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('touchstart');
        vi.advanceTimersByTime(200);
        await wrapper.trigger('touchmove');
        vi.advanceTimersByTime(300);
      });

      it('does not emit the longPress event', () => {
        expect(wrapper.emitted('longPress')).toBeUndefined();
      });
    });
  });

  describe('when the component unmounts during an active touch', () => {
    beforeEach(async () => {
      await wrapper.trigger('touchstart');
      vi.advanceTimersByTime(200);
      wrapper.unmount();
    });

    it('does not emit the longPress event', () => {
      expect(wrapper.emitted('longPress')).toBeUndefined();
    });
  });

  describe('when isAnyOpen is true', () => {
    beforeEach(() => {
      isAnyOpenMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the draggable attribute to false', () => {
      expect(wrapper.attributes('draggable')).toBe('false');
    });
  });

  describe('when isAnyOpen is false', () => {
    beforeEach(() => {
      isAnyOpenMock.value = false;
    });

    describe('when draggable prop is set to false', () => {
      beforeEach(() => {
        wrapper = factory({
          draggable: false,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to false', () => {
        expect(wrapper.attributes('draggable')).toBe('false');
      });
    });

    describe('when the onDragStart event is not attached', () => {
      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to false', () => {
        expect(wrapper.attributes('draggable')).toBe('false');
      });
    });

    describe('when isAnyOpen and draggable prop are set to true and the onDragStart event is attached', () => {
      beforeEach(() => {
        onDragStartMock = vi.fn();
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to true', () => {
        expect(wrapper.attributes('draggable')).toBe('true');
      });
    });
  });
});
