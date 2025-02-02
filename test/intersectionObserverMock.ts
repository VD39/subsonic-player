import { vi } from 'vitest';

export function intersectionObserverMock(
  entry: IntersectionObserverEntry[] = [],
) {
  const disconnectMock = vi.fn();
  const observeMock = vi.fn();

  const intersectionObserverMock = vi.fn((cb) => {
    cb(entry);

    return {
      disconnect: disconnectMock,
      observe: observeMock,
    };
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    value: intersectionObserverMock,
    writable: true,
  });

  return {
    disconnectMock,
    observeMock,
  };
}
