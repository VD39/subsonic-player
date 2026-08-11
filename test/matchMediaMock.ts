import { vi } from 'vitest';

export function matchMediaMock() {
  const matchesMock = ref(false);
  let changeEventCallback: () => void;

  const matchMediaSpy = vi.fn(() => ({
    addEventListener: vi.fn((_event: string, cb: () => void) => {
      changeEventCallback = cb;
    }),
    matches: matchesMock.value,
    media: '',
    onchange: null,
    removeEventListener: vi.fn(),
  }));

  Object.defineProperty(globalThis, 'matchMedia', {
    value: matchMediaSpy,
    writable: true,
  });

  function triggerChangeEvent() {
    changeEventCallback();
  }

  return {
    matchesMock,
    matchMediaSpy,
    triggerChangeEvent,
  };
}
