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
    isAnyOpenMock.value = false;
    containsClassMock.mockReset();
    containsClassMock.mockReturnValueOnce(false);

    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the click event is triggered', () => {
    describe('when the target is an interactive element', () => {
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
    });

    describe('when target is not an interactive element', () => {
      describe('when the isAnyOpen value is true', () => {
        beforeEach(async () => {
          isAnyOpenMock.value = true;
          await wrapper.trigger('click');
        });

        it('does not emit the click event', () => {
          expect(wrapper.emitted('click')).toBeUndefined();
        });
      });

      describe('when the isAnyOpen value is false', () => {
        beforeEach(async () => {
          isAnyOpenMock.value = false;
          await wrapper.trigger('click');
        });

        it('emits the click event', () => {
          expect(wrapper.emitted('click')).toEqual([[expect.any(MouseEvent)]]);
        });
      });
    });
  });

  describe('when the contextmenu event is triggered', () => {
    describe('when the target is an interactive element', () => {
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

      describe(`when the closest target does contain the ${INTERACTION_LINK_CLASS} class`, () => {
        beforeEach(async () => {
          closestSpy.mockReturnValueOnce(document.createElement('a'));
          containsClassMock.mockReturnValueOnce(true);
          await wrapper.trigger('contextmenu');
        });

        it('does not emit the contextMenu event', () => {
          expect(wrapper.emitted('contextMenu')).toBeUndefined();
        });
      });
    });

    describe('when the target is not an interactive element', () => {
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
    describe('when the target is an interactive element', () => {
      describe('when the closest target is a button', () => {
        beforeEach(async () => {
          closestSpy.mockReturnValueOnce(document.createElement('button'));
          await wrapper.trigger('dragstart');
        });

        it('does not emit the dragStart event', () => {
          expect(wrapper.emitted('dragStart')).toBeUndefined();
        });
      });

      describe('when the closest target is an anchor element', () => {
        beforeEach(async () => {
          closestSpy.mockReturnValueOnce(document.createElement('a'));
          await wrapper.trigger('dragstart');
        });

        it('does not emit the dragStart event', () => {
          expect(wrapper.emitted('dragStart')).toBeUndefined();
        });
      });

      describe(`when the closest target does contain the ${INTERACTION_LINK_CLASS} class`, () => {
        beforeEach(async () => {
          closestSpy.mockReturnValueOnce(document.createElement('a'));
          containsClassMock.mockReturnValueOnce(true);
          await wrapper.trigger('dragstart');
        });

        it('does not emit the dragStart event', () => {
          expect(wrapper.emitted('dragStart')).toBeUndefined();
        });
      });
    });

    describe('when the target is not an interactive element', () => {
      beforeEach(async () => {
        containsClassMock.mockReturnValueOnce(true);
        await wrapper.trigger('dragstart');
      });

      it('emits the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toEqual([[expect.any(DragEvent)]]);
      });
    });
  });

  describe('when the mouseenter event is triggered', () => {
    beforeEach(async () => {
      onDragStartMock = vi.fn();
      wrapper = factory();
      await wrapper.trigger('mouseenter');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the draggable attribute to true', () => {
      expect(wrapper.attributes('draggable')).toBe('true');
    });

    describe('when the isAnyOpen value is true', () => {
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

    describe('when the draggable prop is set to false', () => {
      beforeEach(async () => {
        wrapper = factory({ draggable: false });
        await wrapper.trigger('mouseenter');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to false', () => {
        expect(wrapper.attributes('draggable')).toBe('false');
      });
    });

    describe('when the onDragStart event is not attached', () => {
      beforeEach(async () => {
        onDragStartMock = undefined;
        wrapper = factory();
        await wrapper.trigger('mouseenter');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to false', () => {
        expect(wrapper.attributes('draggable')).toBe('false');
      });
    });

    describe('when the mouseleave event is triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('mouseleave');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to false', () => {
        expect(wrapper.attributes('draggable')).toBe('false');
      });
    });
  });

  describe('when the touchstart event is triggered', () => {
    beforeEach(async () => {
      onDragStartMock = vi.fn();
      wrapper = factory();
      await wrapper.trigger('touchstart');
    });

    describe('when the mouseenter event is triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('mouseenter');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the draggable attribute to false', () => {
        expect(wrapper.attributes('draggable')).toBe('false');
      });
    });

    describe('when the mouseleave event is triggered', () => {
      beforeEach(async () => {
        await wrapper.trigger('mouseleave');
      });

      describe('when the mouseenter event is triggered', () => {
        beforeEach(async () => {
          await wrapper.trigger('mouseenter');
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
});
