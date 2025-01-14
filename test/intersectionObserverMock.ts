import { vi } from 'vitest';

export function intersectionObserverMock(
  entry: IntersectionObserverEntry[] = [],
) {
  const disconnectMock = vi.fn();

  const intersectionObserverMock = vi.fn((cb) => {
    cb(entry);

    return {
      disconnect: disconnectMock,
      observe: vi.fn(),
    };
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    value: intersectionObserverMock,
    writable: true,
  });

  return {
    disconnectMock,
  };
}
