import { vi } from 'vitest';

export function mutationObserverMock() {
  const disconnectMock = vi.fn();
  const observeMock = vi.fn();
  const takeRecordsMock = vi.fn();

  let callback: (
    mutations: MutationRecord[],
    observer: MutationObserver,
  ) => void;

  const mutationObserverMock = vi.fn(function (
    cb: (mutations: MutationRecord[], observer: MutationObserver) => void,
  ) {
    callback = cb;

    return {
      disconnect: disconnectMock,
      observe: observeMock,
      takeRecords: takeRecordsMock,
    };
  });

  function triggerMutationObserver(
    mutations: MutationRecord[] = [],
    observer: MutationObserver = {} as MutationObserver,
  ) {
    callback(mutations, observer);
  }

  Object.defineProperty(globalThis, 'MutationObserver', {
    configurable: true,
    value: mutationObserverMock,
    writable: true,
  });

  return {
    disconnectMock,
    mutationObserverMock,
    observeMock,
    takeRecordsMock,
    triggerMutationObserver,
  };
}
