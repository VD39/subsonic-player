import type { ComponentPublicInstance } from 'vue';

import {
  findScrollableParentElement,
  getAutoScrollSpeed,
  getCurrentScrollTop,
  getDragBounds,
  getListContainerElement,
  isItemInitiallyAbove,
  isItemShifted,
  limitDragTop,
  scrollContainerBy,
  setDocumentDraggingStyles,
} from './utils';

describe('isItemInitiallyAbove', () => {
  describe.each([
    ['has', true],
    ['does not have', false],
  ])('when the item %s the isAbove dataset attribute', (_, hasAttribute) => {
    const item = document.createElement('div');

    beforeEach(() => {
      if (hasAttribute) {
        item.dataset.isAbove = '';
      }
    });

    it('returns the correct response', () => {
      expect(isItemInitiallyAbove(item)).toBe(hasAttribute);
    });
  });
});

describe('isItemShifted', () => {
  describe.each([
    ['has', true],
    ['does not have', false],
  ])('when the item %s the isShifted dataset attribute', (_, hasAttribute) => {
    const item = document.createElement('div');

    beforeEach(() => {
      if (hasAttribute) {
        item.dataset.isShifted = '';
      }
    });

    it('returns the correct response', () => {
      expect(isItemShifted(item)).toBe(hasAttribute);
    });
  });
});

describe('setDocumentDraggingStyles', () => {
  describe.each([
    [true, 'none', 'none', 'auto'],
    [false, '', '', ''],
  ])(
    'when enabled is %s',
    (
      enabled,
      expectedTouchAction,
      expectedUserSelect,
      expectedScrollBehavior,
    ) => {
      beforeEach(() => {
        setDocumentDraggingStyles(enabled);
      });

      it('sets the body touchAction style to the correct value', () => {
        expect(document.body.style.touchAction).toBe(expectedTouchAction);
      });

      it('sets the body userSelect style to the correct value', () => {
        expect(document.body.style.userSelect).toBe(expectedUserSelect);
      });

      it('sets the documentElement scrollBehavior style to the correct value', () => {
        expect(document.documentElement.style.scrollBehavior).toBe(
          expectedScrollBehavior,
        );
      });
    },
  );
});

describe('limitDragTop', () => {
  describe.each([
    [200, 500, 100, 200],
    [-20, 500, 100, -10],
    [500, 500, 100, 410],
    [-10, 500, 100, -10],
    [410, 500, 100, 410],
  ])(
    'when top is %i, containerHeight is %i, and itemHeight is %i',
    (top, containerHeight, itemHeight, expected) => {
      it('returns the correct response', () => {
        expect(limitDragTop(top, containerHeight, itemHeight)).toBe(expected);
      });
    },
  );
});

describe('findScrollableParentElement', () => {
  let parent: HTMLDivElement;
  let child: HTMLDivElement;

  beforeEach(() => {
    parent = document.createElement('div');
    child = document.createElement('div');
    parent.appendChild(child);
    document.body.appendChild(parent);
  });

  afterEach(() => {
    parent.remove();
  });

  describe('when the startElement is null', () => {
    it('returns the correct response', () => {
      expect(findScrollableParentElement(null)).toBe(null);
    });
  });

  describe('when no parent has a scrollable overflow style', () => {
    it('returns the correct response', () => {
      expect(findScrollableParentElement(child)).toBe(null);
    });
  });

  describe.each([
    ['overflow', 'auto'],
    ['overflow', 'scroll'],
    ['overflowY', 'auto'],
    ['overflowY', 'scroll'],
  ])('when a parent has %s set to %s', (property, value) => {
    beforeEach(() => {
      parent.style[property as never] = value;
    });

    it('returns the scrollable parent element', () => {
      expect(findScrollableParentElement(child)).toBe(parent);
    });
  });
});

describe('getAutoScrollSpeed', () => {
  describe('when the container is null', () => {
    it('returns the correct response', () => {
      expect(getAutoScrollSpeed(100, null)).toBe(0);
    });
  });

  describe('when the container is provided', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');

      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(
        new DOMRect(0, 100, 0, 500),
      );
    });

    describe.each([
      [300, 0],
      [100, -15],
      [140, -7.5],
      [600, 15],
      [560, 7.5],
    ])('when pointerY is %i', (pointerY, expected) => {
      it('returns the correct response', () => {
        expect(getAutoScrollSpeed(pointerY, container)).toBe(expected);
      });
    });
  });
});

describe('getCurrentScrollTop', () => {
  describe('when the scrollableAncestor is provided', () => {
    let element: HTMLDivElement;

    beforeEach(() => {
      element = document.createElement('div');
      Object.defineProperty(element, 'scrollTop', {
        configurable: true,
        value: 250,
      });
    });

    it('returns the correct response', () => {
      expect(getCurrentScrollTop(element)).toBe(250);
    });
  });

  describe('when the scrollableAncestor is null', () => {
    it('returns the correct response', () => {
      expect(getCurrentScrollTop(null)).toBe(globalThis.scrollY);
    });
  });
});

describe('getDragBounds', () => {
  describe('when the scrollableAncestor is provided', () => {
    let element: HTMLDivElement;

    beforeEach(() => {
      element = document.createElement('div');
    });

    describe.each([
      [100, 600, 100, 600],
      [-50, 600, 0, 600],
      [100, globalThis.innerHeight + 200, 100, globalThis.innerHeight],
    ])(
      'when the rect top is %i and bottom is %i',
      (rectTop, rectBottom, expectedTop, expectedBottom) => {
        beforeEach(() => {
          vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
            new DOMRect(0, rectTop, 0, rectBottom - rectTop),
          );
        });

        it('returns the correct top bound', () => {
          expect(getDragBounds(element).top).toBe(expectedTop);
        });

        it('returns the correct bottom bound', () => {
          expect(getDragBounds(element).bottom).toBe(expectedBottom);
        });
      },
    );
  });

  describe('when the scrollableAncestor is null', () => {
    it('returns the correct top bound', () => {
      expect(getDragBounds(null).top).toBe(0);
    });

    it('returns the correct bottom bound', () => {
      expect(getDragBounds(null).bottom).toBe(globalThis.innerHeight);
    });
  });
});

describe('getListContainerElement', () => {
  const element = document.createElement('div');
  let instance: ComponentPublicInstance;
  let sibling: HTMLSpanElement;

  describe('when the listContainer is null', () => {
    it('returns the correct response', () => {
      expect(getListContainerElement(null)).toBe(null);
    });
  });

  describe('when the listContainer is an HTMLElement', () => {
    it('returns the correct response', () => {
      expect(getListContainerElement(element)).toBe(element);
    });
  });

  describe('when the listContainer is a component with an HTMLElement $el', () => {
    beforeEach(() => {
      instance = {
        $el: element,
      } as unknown as ComponentPublicInstance;
    });

    it('returns the correct response', () => {
      expect(getListContainerElement(instance)).toBe(element);
    });
  });

  describe('when the listContainer is a component with a non-HTMLElement $el', () => {
    describe('when the $el has a nextElementSibling', () => {
      beforeEach(() => {
        const parent = document.createElement('div');
        const comment = document.createComment('');

        sibling = document.createElement('span');
        parent.appendChild(comment);
        parent.appendChild(sibling);

        instance = {
          $el: comment,
        } as unknown as ComponentPublicInstance;
      });

      it('returns the correct response', () => {
        expect(getListContainerElement(instance)).toBe(sibling);
      });
    });

    describe('when the $el has no nextElementSibling', () => {
      beforeEach(() => {
        const comment = document.createComment('');

        instance = {
          $el: comment,
        } as unknown as ComponentPublicInstance;
      });

      it('returns the correct response', () => {
        expect(getListContainerElement(instance)).toBe(null);
      });
    });
  });
});

describe('scrollContainerBy', () => {
  describe('when the scrollableAncestor is provided', () => {
    let scrollTop: number;

    beforeEach(() => {
      scrollTop = 100;
      const element = document.createElement('div');

      Object.defineProperty(element, 'scrollTop', {
        get: () => scrollTop,
        set: (value) => {
          scrollTop = value;
        },
      });

      scrollContainerBy(element, 50);
    });

    it('increments the scrollTop by the delta', () => {
      expect(scrollTop).toBe(150);
    });
  });

  describe('when the scrollableAncestor is null', () => {
    let scrollBySpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      scrollBySpy = vi.spyOn(globalThis, 'scrollBy');
      scrollContainerBy(null, 75);
    });

    it('calls scrollBy with the correct arguments', () => {
      expect(scrollBySpy).toHaveBeenCalledWith(0, 75);
    });
  });
});
