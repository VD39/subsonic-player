import { vi } from 'vitest';

import type { EventHandler } from './types';

const audioEvents: Record<string, EventHandler> = {};

const addEventListenerMock = vi.fn((event: string, handler: EventHandler) => {
  audioEvents[event] = handler;
});

const audioLoadMock = vi.fn();
const pauseMock = vi.fn();
const playMock = vi.fn(() => Promise.resolve());
const removeAttributeMock = vi.fn();
const removeEventListenerMock = vi.fn();
const setAttributeMock = vi.fn();

const audioMock = {
  addEventListener: addEventListenerMock,
  buffered: {
    end: vi.fn(),
    length: 0,
    start: vi.fn(),
  } as unknown as TimeRanges,
  currentTime: 0,
  duration: 0,
  error: null as MediaError | null,
  load: audioLoadMock,
  pause: pauseMock,
  play: playMock,
  playbackRate: 1,
  removeAttribute: removeAttributeMock,
  removeEventListener: removeEventListenerMock,
  setAttribute: setAttributeMock,
  src: '',
  volume: 1,
};

export function audioElementMock() {
  globalThis.Audio = vi.fn(function () {
    return audioMock;
  }) as unknown as typeof Audio;

  return {
    addEventListenerMock,
    audioEvents,
    audioLoadMock,
    audioMock,
    pauseMock,
    playMock,
    removeAttributeMock,
    removeEventListenerMock,
    setAttributeMock,
  };
}
