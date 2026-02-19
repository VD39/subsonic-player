import { vi } from 'vitest';

export function abortControllerMock() {
  const abortMock = vi.fn();

  const signalMock = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as AbortSignal;

  const abortControllerConstructorMock = vi.fn(function () {
    return {
      abort: abortMock,
      signal: signalMock,
    };
  });

  Object.defineProperty(globalThis, 'AbortController', {
    configurable: true,
    value: abortControllerConstructorMock,
    writable: true,
  });

  return {
    abortControllerConstructorMock,
    abortMock,
    signalMock,
  };
}
