import { vi } from 'vitest';

export function requestAnimationFrameMock() {
  let lastCallback: (time: number) => void;

  const requestAnimationFrameSpy = vi
    .spyOn(globalThis, 'requestAnimationFrame')
    .mockImplementation((cb) => {
      lastCallback = cb;
      return 1;
    });

  const cancelAnimationFrameSpy = vi
    .spyOn(globalThis, 'cancelAnimationFrame')
    .mockImplementation(() => undefined);

  function triggerAnimationFrame(time = 0) {
    lastCallback(time);
  }

  return {
    cancelAnimationFrameSpy,
    requestAnimationFrameSpy,
    triggerAnimationFrame,
  };
}
