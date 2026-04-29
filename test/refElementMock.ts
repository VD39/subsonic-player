import { vi } from 'vitest';

import type { EventCallback } from './types';

export function refElementMock() {
  const containsMock = vi.fn().mockReturnValue(false);

  const getBoundingClientRectMock = vi.fn().mockReturnValue({
    bottom: 50,
    height: 10,
    left: 35,
    right: 189,
    top: 100,
    width: 54,
  } as unknown as DOMRect);

  const refMockElementEvent: Record<string, EventCallback> = {};

  const addEventListenerMock = vi.fn().mockImplementation((event, cb) => {
    refMockElementEvent[event] = cb;
  });

  const parentAddEventListenerMock = vi.fn().mockImplementation((event, cb) => {
    refMockElementEvent[event] = cb;
  });

  const refMock = ref({
    addEventListener: addEventListenerMock,
    contains: containsMock,
    getBoundingClientRect: getBoundingClientRectMock,
    parentElement: {
      addEventListener: parentAddEventListenerMock,
    },
  }) as unknown as Ref<HTMLElement | null>;

  return {
    addEventListenerMock,
    containsMock,
    getBoundingClientRectMock,
    parentAddEventListenerMock,
    refMock,
    refMockElementEvent,
  };
}
