import { vi } from 'vitest';

import type { EventHandler } from './types';

const audioEvents: Record<string, EventHandler[]> = {};

function fireEvent(event: string, ...args: unknown[]) {
  audioEvents[event]?.forEach((handler) => {
    handler(...args);
  });
}

const addEventListenerMock = vi.fn((event: string, handler: EventHandler) => {
  if (!audioEvents[event]) {
    audioEvents[event] = [];
  }
  audioEvents[event].push(handler);
});

const audioLoadMock = vi.fn();
const pauseMock = vi.fn();
const playMock = vi.fn(() => Promise.resolve());
const removeAttributeMock = vi.fn();
const removeEventListenerMock = vi.fn(
  (event: string, handler: EventHandler) => {
    if (audioEvents[event]) {
      audioEvents[event] = audioEvents[event].filter((h) => h !== handler);
    }
  },
);
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

function createGainMockNode() {
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: {
      linearRampToValueAtTime: vi.fn(),
      setValueAtTime: vi.fn(),
      value: 1,
    },
  };
}

const crossfadeGainNodeMock = createGainMockNode();
const masterVolumeNodeMock = createGainMockNode();
const replayGainNodeMock = createGainMockNode();
const sourceNodeMock = {
  connect: vi.fn(),
  disconnect: vi.fn(),
};
const createGainMock = vi.fn();
const createMediaElementSourceMock = vi.fn(() => sourceNodeMock);
const audioContextCloseMock = vi.fn();
const audioContextResumeMock = vi.fn();

const audioContextMock = {
  close: audioContextCloseMock,
  createGain: createGainMock,
  createMediaElementSource: createMediaElementSourceMock,
  destination: {},
  resume: audioContextResumeMock,
  state: 'suspended',
};

export function audioElementMock() {
  globalThis.Audio = vi.fn(function () {
    return audioMock;
  }) as unknown as typeof Audio;

  createGainMock.mockReset();
  createGainMock
    .mockReturnValueOnce(masterVolumeNodeMock)
    .mockReturnValueOnce(replayGainNodeMock)
    .mockReturnValueOnce(crossfadeGainNodeMock)
    .mockReturnValue(masterVolumeNodeMock);

  globalThis.AudioContext = vi.fn(function () {
    return audioContextMock;
  }) as unknown as typeof AudioContext;

  return {
    addEventListenerMock,
    audioContextCloseMock,
    audioContextMock,
    audioContextResumeMock,
    audioEvents,
    audioLoadMock,
    audioMock,
    createGainMock,
    createMediaElementSourceMock,
    crossfadeGainNodeMock,
    fireEvent,
    masterVolumeNodeMock,
    pauseMock,
    playMock,
    removeAttributeMock,
    removeEventListenerMock,
    replayGainNodeMock,
    setAttributeMock,
    sourceNodeMock,
  };
}
