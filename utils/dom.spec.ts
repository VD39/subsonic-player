import { findClosestElement } from './dom';

vi.unmock('./dom');

describe('findClosestElement', () => {
  describe.each([
    ['null', null],
    ['not an Element', {} as EventTarget],
  ])('when target is %s', (_, target) => {
    it('returns the correct response', () => {
      expect(findClosestElement(target, 'className')).toBe(null);
    });
  });

  describe('when target is an Element', () => {
    describe('when no ancestor matches the className', () => {
      it('returns the correct response', () => {
        const element = document.createElement('div');

        expect(findClosestElement(element, 'className')).toBe(null);
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
