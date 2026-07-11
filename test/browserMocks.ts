import { vi } from 'vitest';

export function cachesMock() {
  const deleteMock = vi.fn().mockResolvedValue(true);
  const keysMock = vi.fn();

  function applyMock() {
    Object.defineProperty(globalThis, 'caches', {
      configurable: true,
      value: {
        delete: deleteMock,
        keys: keysMock,
      },
    });
  }

  applyMock();

  function restore() {
    applyMock();
  }

  return {
    deleteMock,
    keysMock,
    restore,
  };
}

export function navigatorStorageMock() {
  const estimateMock = vi.fn();

  function applyMock() {
    Object.defineProperty(globalThis.navigator, 'storage', {
      configurable: true,
      get: function getStorage() {
        return {
          estimate: estimateMock,
        };
      },
    });
  }

  applyMock();

  function restore() {
    applyMock();
  }

  return {
    estimateMock,
    restore,
  };
}
