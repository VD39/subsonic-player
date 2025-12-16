import { vi } from 'vitest';

export function intersectionObserverMock(
  entry: IntersectionObserverEntry[] = [],
) {
  const disconnectMock = vi.fn();
  const observeMock = vi.fn(() => undefined);
  const observerDisconnectMock = vi.fn();

  const intersectionObserverMock = vi.fn(function (cb) {
    cb(entry, {
      disconnect: observerDisconnectMock,
    });

    return {
      disconnect: disconnectMock,
      observe: observeMock,
    };
  });

  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    value: intersectionObserverMock,
    writable: true,
  });

  return {
    disconnectMock,
    observeMock,
    observerDisconnectMock,
  };
}
