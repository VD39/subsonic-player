import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import audioPlayerPlugin from './audio-player.client';

const { initAudioPlayerMock } = useAudioPlayerMock();
const { loadFromServerMock } = useQueueMock();

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

  it('does not call the loadFromServer function on plugin initialisation', () => {
    expect(loadFromServerMock).not.toHaveBeenCalled();
  });

  it('does not call the initAudioPlayer function on plugin initialisation', () => {
    expect(initAudioPlayerMock).not.toHaveBeenCalled();
  });

  describe('when app:suspense:resolve hook fires', () => {
    beforeEach(() => {
      hookCallback();
    });

    it('calls the loadFromServer function', () => {
      expect(loadFromServerMock).toHaveBeenCalled();
    });

    it('calls the initAudioPlayer function', () => {
      expect(initAudioPlayerMock).toHaveBeenCalled();
    });
  });
});
