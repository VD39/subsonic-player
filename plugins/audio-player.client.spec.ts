import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import audioPlayerPlugin from './audio-player.client';

const { initAudioPlayerMock } = useAudioPlayerMock();

let hookCallback: () => void;

const nuxtApp = {
  hook: vi.fn((_event: string, cb: () => void) => {
    hookCallback = cb;
  }),
} as never;

describe('audio-player.client plugin', () => {
  beforeEach(() => {
    audioPlayerPlugin(nuxtApp);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not call initAudioPlayer on plugin initialisation', () => {
    expect(initAudioPlayerMock).not.toHaveBeenCalled();
  });

  describe('when app:suspense:resolve hook fires', () => {
    beforeEach(() => {
      hookCallback();
    });

    it('calls the initAudioPlayer function', () => {
      expect(initAudioPlayerMock).toHaveBeenCalled();
    });
  });
});
