import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import playbackRestorePlugin from './playback-restore.client';

const isAuthenticatedMock = ref(false);

mockNuxtImport('useAuth', () => () => ({
  isAuthenticated: isAuthenticatedMock,
}));

let hookCallback: () => void;

const nuxtApp = {
  hook: vi.fn((_event: string, cb: () => void) => {
    hookCallback = cb;
  }),
} as never;

const { restoreAudioPlayerStateMock } = useAudioPlayerMock();
const {
  mergeBookmarksToCurrentQueueMock,
  restoreQueueStateFromLocalMock,
  restoreQueueStateFromServerMock,
} = useQueueMock();

describe('playback-restore.client plugin', () => {
  beforeEach(() => {
    playbackRestorePlugin(nuxtApp);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the plugin is initialised', () => {
    it('does not call the restoreQueueStateFromServer function', () => {
      expect(restoreQueueStateFromServerMock).not.toHaveBeenCalled();
    });

    it('does not call the restoreQueueState function', () => {
      expect(restoreQueueStateFromLocalMock).not.toHaveBeenCalled();
    });

    it('does not call the restoreAudioPlayerState function', () => {
      expect(restoreAudioPlayerStateMock).not.toHaveBeenCalled();
    });
  });

  describe('when the page:finish hook is triggered', () => {
    describe('when the isAuthenticated value is false', () => {
      beforeEach(() => {
        hookCallback();
      });

      it('does not call the restoreQueueStateFromServer function', () => {
        expect(restoreQueueStateFromServerMock).not.toHaveBeenCalled();
      });

      it('does not call the mergeBookmarksToCurrentQueue function', () => {
        expect(mergeBookmarksToCurrentQueueMock).not.toHaveBeenCalled();
      });

      it('does not call the restoreQueueState function', () => {
        expect(restoreQueueStateFromLocalMock).not.toHaveBeenCalled();
      });

      it('does not call the restoreAudioPlayerState function', () => {
        expect(restoreAudioPlayerStateMock).not.toHaveBeenCalled();
      });
    });

    describe('when the isAuthenticated value is true', () => {
      beforeEach(() => {
        isAuthenticatedMock.value = true;
        hookCallback();
      });

      it('calls the restoreQueueStateFromServer function', () => {
        expect(restoreQueueStateFromServerMock).toHaveBeenCalled();
      });

      it('calls the mergeBookmarksToCurrentQueue function', () => {
        expect(mergeBookmarksToCurrentQueueMock).toHaveBeenCalled();
      });

      it('calls the restoreQueueState function', () => {
        expect(restoreQueueStateFromLocalMock).toHaveBeenCalled();
      });

      it('calls the restoreAudioPlayerState function', () => {
        expect(restoreAudioPlayerStateMock).toHaveBeenCalled();
      });
    });
  });
});
