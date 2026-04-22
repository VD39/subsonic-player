import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { abortControllerMock } from '@/test/abortControllerMock';
import {
  documentEventListenerMock,
  htmlEventListenerMock,
} from '@/test/eventListenersMock';
import { mutationObserverMock } from '@/test/mutationObserverMock';
import { requestAnimationFrameMock } from '@/test/requestAnimationFrameMock';
import { withSetup } from '@/test/withSetup';

import { useSortableList } from './index';

vi.useFakeTimers();

const isDraggingMock = ref(false);

mockNuxtImport('useSortableListState', () => () => ({
  isDragging: isDraggingMock,
}));

const { documentAddEventListenerSpy, documentEvents } =
  documentEventListenerMock();
const { htmlAddEventListenerSpy, htmlEvents } = htmlEventListenerMock();
const { abortControllerConstructorMock, abortMock, signalMock } =
  abortControllerMock();
const {
  cancelAnimationFrameSpy,
  requestAnimationFrameSpy,
  triggerAnimationFrame,
} = requestAnimationFrameMock();
const {
  disconnectMock: mutationObserverDisconnectMock,
  mutationObserverMock: mutationObserverConstructorMock,
  observeMock: mutationObserverObserveMock,
  triggerMutationObserver,
} = mutationObserverMock();

class TestTouchEvent extends Event {
  changedTouches: Touch[] = [];
  touches: Touch[] = [];
}

Object.defineProperty(globalThis, 'TouchEvent', {
  configurable: true,
  value: TestTouchEvent,
  writable: true,
});

const vibrateMock = vi.fn();

Object.defineProperty(globalThis.navigator, 'vibrate', {
  configurable: true,
  value: vibrateMock,
  writable: true,
});

// Assigns a container element to the ref and waits two ticks for the watcher to initialize.
async function bindContainer(
  listContainerRef: ReturnType<typeof ref<HTMLElement | null>>,
  container: HTMLElement,
) {
  listContainerRef.value = container;

  await nextTick();
  await nextTick();
}

// Creates a fake MouseEvent with a target element and vertical position.
function createMouseEvent(target: EventTarget | null, clientY: number) {
  return {
    clientY,
    preventDefault: vi.fn(),
    target,
  } as unknown as MouseEvent;
}

// Builds a DOM fixture with a scrollable parent, list container, sortable items and drag handles.
function createSortableFixture(itemCount = 3) {
  const container = document.createElement('div');
  const scrollParent = document.createElement('div');
  const scrollState = {
    value: 0,
  };
  const items: HTMLDivElement[] = [];
  const handles: HTMLButtonElement[] = [];

  scrollParent.style.overflowY = 'auto';

  Object.defineProperty(scrollParent, 'scrollTop', {
    configurable: true,
    get: () => scrollState.value,
    set: (value: number) => {
      scrollState.value = value;
    },
  });

  Object.defineProperty(container, 'scrollHeight', {
    configurable: true,
    value: itemCount * 60,
  });

  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(10, 20, 180, itemCount * 60),
  );

  vi.spyOn(scrollParent, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 0, 220),
  );

  Array.from({ length: itemCount }, (_, index) =>
    createSortableItem(index),
  ).forEach(({ handle, item }) => {
    handles.push(handle);
    items.push(item);
    container.appendChild(item);
  });

  scrollParent.appendChild(container);
  document.body.appendChild(scrollParent);

  return {
    container,
    handles,
    items,
    scrollParent,
    scrollState,
  };
}

// Creates a single sortable item element with a drag handle and mocked bounding rect.
function createSortableItem(index: number) {
  const item = document.createElement('div');
  const handle = document.createElement('button');
  const top = 20 + index * 60;

  item.classList.add(SORTABLE_LIST_CLASS_NAMES.item);
  handle.classList.add(SORTABLE_LIST_CLASS_NAMES.dragHandle);
  item.appendChild(handle);

  vi.spyOn(item, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(10, top, 180, 50),
  );

  return {
    handle,
    item,
  };
}

// Mounts the composable inside a Vue app and returns the app instance, container ref and reorder callback.
function createSortableSetup(onReorder = vi.fn()) {
  const listContainerRef = ref<HTMLElement | null>(null);
  const { app } = withSetup(() =>
    useSortableList({
      listContainerRef: listContainerRef as never,
      onReorder,
    }),
  );

  return {
    app,
    listContainerRef,
    onReorder,
  };
}

// Creates a fake TouchEvent with touch position data and an empty touches list for end/cancel types.
function createTouchEvent(
  type: string,
  target: EventTarget | null,
  position: {
    clientX: number;
    clientY: number;
  },
) {
  const event = new TouchEvent(type);
  const touch = {
    clientX: position.clientX,
    clientY: position.clientY,
  } as Touch;

  Object.defineProperty(event, 'changedTouches', {
    configurable: true,
    value: [touch],
  });
  Object.defineProperty(event, 'target', {
    configurable: true,
    value: target,
  });
  Object.defineProperty(event, 'touches', {
    configurable: true,
    value: type === 'touchend' || type === 'touchcancel' ? [] : [touch],
  });

  return event;
}

describe('useSortableList', () => {
  let fixture: ReturnType<typeof createSortableFixture>;
  let sortableSetup: ReturnType<typeof createSortableSetup>;

  afterEach(() => {
    isDraggingMock.value = false;
    vi.clearAllMocks();
  });

  describe('when sortable interactions are initialized', () => {
    beforeEach(async () => {
      fixture = createSortableFixture();
      sortableSetup = createSortableSetup();
      abortControllerConstructorMock.mockClear();

      await bindContainer(sortableSetup.listContainerRef, fixture.container);
    });

    it('adds the idle class to all sortable items', () => {
      expect(
        fixture.items.every((item) =>
          item.classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
        ),
      ).toBe(true);
    });

    it('calls the AbortController constructor', () => {
      expect(abortControllerConstructorMock).toHaveBeenCalled();
    });

    it('adds the mousedown event listener function', () => {
      expect(htmlAddEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    it('adds the touchstart event listener function', () => {
      expect(htmlAddEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
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

    it('adds the mouseup event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
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
          signal: signalMock,
        },
      );
    });

    it('adds the touchcancel event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'touchcancel',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    it('calls the observe function with the correct parameters', () => {
      expect(mutationObserverObserveMock).toHaveBeenCalledWith(
        fixture.container,
        {
          childList: true,
          subtree: false,
        },
      );
    });

    describe('when the list container ref changes', () => {
      let secondFixture: ReturnType<typeof createSortableFixture>;

      beforeEach(async () => {
        secondFixture = createSortableFixture();
        abortMock.mockClear();

        await bindContainer(
          sortableSetup.listContainerRef,
          secondFixture.container,
        );
      });

      it('calls the abort function', () => {
        expect(abortMock).toHaveBeenCalled();
      });

      it('calls the disconnect function', () => {
        expect(mutationObserverDisconnectMock).toHaveBeenCalledTimes(1);
      });

      it('adds the idle class to the new container items', () => {
        expect(
          secondFixture.items.every((item) =>
            item.classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
          ),
        ).toBe(true);
      });

      describe('when the next ref does not resolve to a sortable container', () => {
        beforeEach(async () => {
          mutationObserverConstructorMock.mockClear();

          sortableSetup.listContainerRef.value = {
            $el: document.createComment('missing-sortable-container'),
          } as never;

          await nextTick();
          await nextTick();
        });

        it('does not call the MutationObserver constructor', () => {
          expect(mutationObserverConstructorMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the mutation observer runs while dragging is false', () => {
      let idleItem: HTMLDivElement;

      beforeEach(() => {
        idleItem = createSortableItem(3).item;

        fixture.container.appendChild(idleItem);
        triggerMutationObserver();
        triggerAnimationFrame();
      });

      it('adds the idle class to the new item', () => {
        expect(
          idleItem.classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
        ).toBe(true);
      });
    });

    describe('when the mutation observer runs while dragging is true', () => {
      let activeDragItem: HTMLDivElement;

      beforeEach(() => {
        activeDragItem = createSortableItem(4).item;
        isDraggingMock.value = true;

        fixture.container.appendChild(activeDragItem);
        triggerMutationObserver();
        triggerAnimationFrame();
      });

      it('does not add the idle class to the new item', () => {
        expect(
          activeDragItem.classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
        ).toBe(false);
      });
    });
  });

  describe('when mouse drag interactions are triggered', () => {
    let startEvent: MouseEvent;

    afterEach(() => {
      sortableSetup.app.unmount();
    });

    beforeEach(async () => {
      fixture = createSortableFixture();
      sortableSetup = createSortableSetup();

      await bindContainer(sortableSetup.listContainerRef, fixture.container);

      startEvent = createMouseEvent(fixture.handles[1], 90);
      htmlEvents.mousedown(startEvent);
    });

    it('calls the preventDefault function on the start event', () => {
      expect(startEvent.preventDefault).toHaveBeenCalled();
    });

    it('sets isDragging to true', () => {
      expect(isDraggingMock.value).toBe(true);
    });

    it('adds the draggable class to the dragged item', () => {
      expect(
        fixture.items[1].classList.contains(
          SORTABLE_LIST_CLASS_NAMES.draggable,
        ),
      ).toBe(true);
    });

    it('sets the isAbove data attribute on the preceding item', () => {
      expect(fixture.items[0].dataset.isAbove).toBe('');
    });

    it('sets the dragged item position to absolute', () => {
      expect(fixture.items[1].style.position).toBe('absolute');
    });

    it('inserts the spacer element after the dragged item', () => {
      expect(fixture.items[1].nextElementSibling).not.toBe(fixture.items[2]);
    });

    describe('when the mousedown event is triggered again during the drag', () => {
      beforeEach(() => {
        requestAnimationFrameSpy.mockClear();
        htmlEvents.mousedown(createMouseEvent(fixture.handles[2], 150));
      });

      it('does not call the requestAnimationFrame function', () => {
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the pointer moves upward', () => {
      beforeEach(() => {
        documentEvents.mousemove(createMouseEvent(null, 30));
      });

      it('sets the isShifted data attribute on the item above', () => {
        expect(fixture.items[0].dataset.isShifted).toBe('');
      });

      it('sets the correct transform on the item above', () => {
        expect(fixture.items[0].style.transform).toBe('translateY(50px)');
      });
    });

    describe('when the pointer moves downward', () => {
      let moveEvent: MouseEvent;

      beforeEach(() => {
        moveEvent = createMouseEvent(null, 170);
        documentEvents.mousemove(moveEvent);
      });

      it('calls the preventDefault function on the move event', () => {
        expect(moveEvent.preventDefault).toHaveBeenCalled();
      });

      it('sets the isShifted data attribute on the item below', () => {
        expect(fixture.items[2].dataset.isShifted).toBe('');
      });

      it('sets the correct transform on the item below', () => {
        expect(fixture.items[2].style.transform).toBe('translateY(-50px)');
      });

      describe('when the pointer is released', () => {
        beforeEach(async () => {
          documentEvents.mouseup();
          vi.runOnlyPendingTimers();
          await nextTick();
        });

        it('calls the onReorder function with the correct parameters', () => {
          expect(sortableSetup.onReorder).toHaveBeenCalledWith(1, 2);
        });

        it('sets isDragging to false', () => {
          expect(isDraggingMock.value).toBe(false);
        });

        it('adds the idle class to the dragged item', () => {
          expect(
            fixture.items[1].classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
          ).toBe(true);
        });

        it('removes the draggable class from the dragged item', () => {
          expect(
            fixture.items[1].classList.contains(
              SORTABLE_LIST_CLASS_NAMES.draggable,
            ),
          ).toBe(false);
        });

        it('clears the dragged item position style', () => {
          expect(fixture.items[1].style.position).toBe('');
        });

        it('clears the shifted item transform style', () => {
          expect(fixture.items[2].style.transform).toBe('');
        });

        it('clears the body userSelect style', () => {
          expect(document.body.style.userSelect).toBe('');
        });

        it('calls the cancelAnimationFrame function', () => {
          expect(cancelAnimationFrameSpy).toHaveBeenCalled();
        });

        describe('when the cancelled auto-scroll callback runs again', () => {
          beforeEach(() => {
            triggerAnimationFrame();
            documentEvents.mousemove(createMouseEvent(null, 80));
          });

          it('does not call the onReorder function again', () => {
            expect(sortableSetup.onReorder).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('when the pointer moves near the container edge', () => {
      beforeEach(() => {
        documentEvents.mousemove(createMouseEvent(null, 190));
        triggerAnimationFrame();
      });

      it('sets the scrollTop to a value greater than 0', () => {
        expect(fixture.scrollState.value).toBeGreaterThan(0);
      });

      it('sets the first idle item transition to none', () => {
        expect(fixture.items[0].style.transition).toBe('none');
      });

      it('sets the last idle item transition to none', () => {
        expect(fixture.items[2].style.transition).toBe('none');
      });

      describe('when the pointer moves away from the container edge', () => {
        beforeEach(() => {
          documentEvents.mousemove(createMouseEvent(null, 100));
          triggerAnimationFrame();
        });

        it('clears the first idle item transition style', () => {
          expect(fixture.items[0].style.transition).toBe('');
        });

        it('clears the last idle item transition style', () => {
          expect(fixture.items[2].style.transition).toBe('');
        });
      });
    });
  });

  describe('when touch drag interactions are triggered', () => {
    afterEach(() => {
      sortableSetup.app.unmount();
    });

    beforeEach(async () => {
      fixture = createSortableFixture();
      sortableSetup = createSortableSetup();

      await bindContainer(sortableSetup.listContainerRef, fixture.container);
    });

    describe('when the drag start target is invalid', () => {
      beforeEach(() => {
        htmlEvents.mousedown(
          createMouseEvent(document.createTextNode('drag'), 80),
        );
        htmlEvents.mousedown(
          createMouseEvent(document.createElement('div'), 80),
        );

        const orphanHandle = document.createElement('button');

        orphanHandle.classList.add(SORTABLE_LIST_CLASS_NAMES.dragHandle);

        htmlEvents.mousedown(createMouseEvent(orphanHandle, 80));
      });

      it('does not call the requestAnimationFrame function', () => {
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
      });

      it('does not set isDragging to true', () => {
        expect(isDraggingMock.value).toBe(false);
      });
    });

    describe('when the touch moves beyond the drag slop before the long press completes', () => {
      beforeEach(() => {
        documentEvents.touchmove(
          createTouchEvent('touchmove', fixture.handles[0], {
            clientX: 10,
            clientY: 10,
          }),
        );

        htmlEvents.touchstart(
          createTouchEvent('touchstart', fixture.handles[0], {
            clientX: 40,
            clientY: 80,
          }),
        );

        documentEvents.touchmove(
          createTouchEvent('touchmove', fixture.handles[0], {
            clientX: 40 + TOUCH_MOVE_TOLERANCE + 1,
            clientY: 80,
          }),
        );

        vi.advanceTimersByTime(TOUCH_LONG_PRESS_DELAY);
        documentEvents.touchend();
      });

      it('does not call the onReorder function', () => {
        expect(sortableSetup.onReorder).not.toHaveBeenCalled();
      });

      it('does not add the draggable class to the item', () => {
        expect(
          fixture.items[0].classList.contains(
            SORTABLE_LIST_CLASS_NAMES.draggable,
          ),
        ).toBe(false);
      });
    });

    describe('when the touch long press completes', () => {
      beforeEach(() => {
        htmlEvents.touchstart(
          createTouchEvent('touchstart', fixture.handles[0], {
            clientX: 50,
            clientY: 40,
          }),
        );

        vi.advanceTimersByTime(TOUCH_LONG_PRESS_DELAY);
      });

      it('calls the vibrate function', () => {
        expect(vibrateMock).toHaveBeenCalledWith(50);
      });

      it('sets isDragging to true', () => {
        expect(isDraggingMock.value).toBe(true);
      });

      it('adds the draggable class to the item', () => {
        expect(
          fixture.items[0].classList.contains(
            SORTABLE_LIST_CLASS_NAMES.draggable,
          ),
        ).toBe(true);
      });

      describe('when the touchend event is triggered', () => {
        beforeEach(async () => {
          documentEvents.touchend();
          vi.runOnlyPendingTimers();
          await nextTick();
        });

        it('does not call the onReorder function', () => {
          expect(sortableSetup.onReorder).not.toHaveBeenCalled();
        });

        it('sets isDragging to false', () => {
          expect(isDraggingMock.value).toBe(false);
        });
      });

      describe('when the touchcancel event is triggered', () => {
        beforeEach(async () => {
          documentEvents.touchcancel();
          vi.runOnlyPendingTimers();
          await nextTick();
        });

        it('does not call the onReorder function', () => {
          expect(sortableSetup.onReorder).not.toHaveBeenCalled();
        });

        it('sets isDragging to false', () => {
          expect(isDraggingMock.value).toBe(false);
        });
      });
    });
  });

  describe('when the composable is unmounted during a drag', () => {
    beforeEach(async () => {
      fixture = createSortableFixture();
      sortableSetup = createSortableSetup();

      await bindContainer(sortableSetup.listContainerRef, fixture.container);

      htmlEvents.mousedown(createMouseEvent(fixture.handles[1], 90));
      documentEvents.mousemove(createMouseEvent(null, 190));
      triggerAnimationFrame();
      sortableSetup.app.unmount();
    });

    it('calls the abort function', () => {
      expect(abortMock).toHaveBeenCalled();
    });

    it('calls the disconnect function', () => {
      expect(mutationObserverDisconnectMock).toHaveBeenCalled();
    });

    it('clears the body touchAction style', () => {
      expect(document.body.style.touchAction).toBe('');
    });

    it('clears the body userSelect style', () => {
      expect(document.body.style.userSelect).toBe('');
    });

    it('clears the idle item transition style', () => {
      expect(fixture.items[0].style.transition).toBe('');
    });

    it('adds the idle class to the dragged item', () => {
      expect(
        fixture.items[1].classList.contains(SORTABLE_LIST_CLASS_NAMES.idle),
      ).toBe(true);
    });

    it('removes the draggable class from the dragged item', () => {
      expect(
        fixture.items[1].classList.contains(
          SORTABLE_LIST_CLASS_NAMES.draggable,
        ),
      ).toBe(false);
    });
  });
});
