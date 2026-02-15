import { vi } from 'vitest';

export function classListMock() {
  const addClassMock = vi.fn();
  const containsClassMock = vi.fn();
  const removeClassMock = vi.fn();

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get() {
      return {
        add: addClassMock,
        contains: containsClassMock,
        remove: removeClassMock,
      };
    },
  });

  return {
    addClassMock,
    containsClassMock,
    removeClassMock,
  };
}
