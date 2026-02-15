import { vi } from 'vitest';

import type { EventCallback } from './types';

export function documentEventListenerMock() {
  const documentEvents: Record<string, EventCallback> = {};
  const originalAddEventListener = document.addEventListener;

  const documentAddEventListenerSpy = vi
    .spyOn(document, 'addEventListener')
    .mockImplementation(function (
      this: Document,
      ...args: Parameters<typeof document.addEventListener>
    ) {
      const [event, cb] = args;
      documentEvents[event] = cb as EventCallback;

      // We need to call the original implementation to allow events to be triggered.
      return originalAddEventListener.apply(this, args);
    });

  const documentRemoveEventListenerSpy = vi.spyOn(
    document,
    'removeEventListener',
  );

  return {
    documentAddEventListenerSpy,
    documentEvents,
    documentRemoveEventListenerSpy,
  };
}

export function htmlEventListenerMock() {
  const htmlEvents: Record<string, EventCallback> = {};
  const originalAddEventListener = HTMLElement.prototype.addEventListener;

  const htmlAddEventListenerSpy = vi
    .spyOn(HTMLElement.prototype, 'addEventListener')
    .mockImplementation(function (
      this: HTMLElement,
      ...args: Parameters<typeof HTMLElement.prototype.addEventListener>
    ) {
      const [event, cb] = args;
      htmlEvents[event] = cb as EventCallback;

      // We need to call the original implementation to allow events to be triggered.
      return originalAddEventListener.apply(this, args);
    });

  const htmlRemoveEventListenerSpy = vi.spyOn(
    HTMLElement.prototype,
    'removeEventListener',
  );

  return {
    htmlAddEventListenerSpy,
    htmlEvents,
    htmlRemoveEventListenerSpy,
  };
}

export function windowEventListenerMock() {
  const windowEvents: Record<string, EventCallback> = {};
  const originalAddEventListener = globalThis.addEventListener;

  const windowAddEventListenerSpy = vi
    .spyOn(globalThis, 'addEventListener')
    .mockImplementation(function (
      this: Window,
      ...args: Parameters<typeof globalThis.addEventListener>
    ) {
      const [event, cb] = args;
      windowEvents[event] = cb as EventCallback;

      // We need to call the original implementation to allow events to be triggered.
      return originalAddEventListener.apply(this, args);
    });

  const windowRemoveEventListenerSpy = vi.spyOn(
    globalThis,
    'removeEventListener',
  );

  return {
    windowAddEventListenerSpy,
    windowEvents,
    windowRemoveEventListenerSpy,
  };
}
