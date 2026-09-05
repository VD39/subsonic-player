import { findClosestElement, isInteractiveElement } from './dom';

describe('findClosestElement', () => {
  describe.each([
    ['null', null],
    ['a non-Element', {} as EventTarget],
  ])('when the value is %o', (_, target) => {
    it('returns the correct response', () => {
      expect(findClosestElement(target, 'className')).toBeNull();
    });
  });

  describe('when the target is an Element', () => {
    describe('when no ancestor matches the className', () => {
      it('returns the correct response', () => {
        const element = document.createElement('div');

        expect(findClosestElement(element, 'className')).toBeNull();
      });
    });

    describe('when the target itself matches the className', () => {
      it('returns the correct response', () => {
        const element = document.createElement('div');
        element.classList.add('className');

        expect(findClosestElement(element, 'className')).toBe(element);
      });
    });

    describe('when an ancestor matches the className', () => {
      it('returns the correct response', () => {
        const parent = document.createElement('div');
        parent.classList.add('className');

        const child = document.createElement('span');
        parent.appendChild(child);

        expect(findClosestElement(child, 'className')).toBe(parent);
      });
    });
  });
});

describe('isInteractiveElement', () => {
  describe.each([null, undefined])('when the value is %s', (target) => {
    it('returns the correct response', () => {
      expect(isInteractiveElement(target as unknown as EventTarget)).toBe(
        false,
      );
    });
  });

  describe('when the value is a non-HTML element', () => {
    it('returns the correct response', () => {
      const target = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );

      expect(isInteractiveElement(target)).toBe(false);
    });
  });

  describe.each(['input', 'textarea', 'select', 'button', 'a'])(
    'when the value is an %s element',
    (tagName) => {
      it('returns the correct response', () => {
        const element = document.createElement(tagName);

        expect(isInteractiveElement(element)).toBe(true);
      });
    },
  );

  describe('when the value is a contenteditable element', () => {
    it('returns the correct response', () => {
      const element = document.createElement('div');
      element.setAttribute('contenteditable', 'true');

      expect(isInteractiveElement(element)).toBe(true);
    });
  });

  describe.each(INTERACTIVE_ROLES)(
    'when the value is an element with the %s role',
    (role) => {
      it('returns the correct response', () => {
        const element = document.createElement('div');
        element.setAttribute('role', role);

        expect(isInteractiveElement(element)).toBe(true);
      });
    },
  );

  describe('when the value is a plain div element', () => {
    it('returns the correct response', () => {
      const element = document.createElement('div');

      expect(isInteractiveElement(element)).toBe(false);
    });
  });

  describe('when the value is the body element', () => {
    it('returns the correct response', () => {
      expect(isInteractiveElement(document.body)).toBe(false);
    });
  });
});
