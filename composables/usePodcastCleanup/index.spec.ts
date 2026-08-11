import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import {
  getFormattedPodcastEpisodesMock,
  getFormattedQueueTracksMock,
} from '@/test/helpers';

import { usePodcastCleanup } from './index';

const podcastEpisode = getFormattedPodcastEpisodesMock()[0];
const anotherPodcastEpisodes = getFormattedPodcastEpisodesMock(1, {
  id: 'another-id',
});

const podcastQueueTracks = getFormattedPodcastEpisodesMock(2, {
  podcastId: 'queue-id',
});

const queueTrack = getFormattedQueueTracksMock()[0];

const { deleteBookmarkMock, getBookmarksMock } = vi.hoisted(() => ({
  deleteBookmarkMock: vi.fn(),
  getBookmarksMock: vi.fn(),
}));

mockNuxtImport('useBookmark', (original) => () => ({
  ...original(),
  deleteBookmark: deleteBookmarkMock,
  getBookmarks: getBookmarksMock,
}));

const currentTrackMock = ref<PlayableTrack>(podcastEpisode);
const queueListMock = ref<PlayableTrack[]>([]);
const removeAllByTrackIdMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useQueue', (original) => () => ({
  ...original(),
  currentTrack: currentTrackMock,
  queueList: queueListMock,
  removeAllByTrackId: removeAllByTrackIdMock,
}));

const isPlayingMock = ref(false);
const {
  playCurrentTrackFromQueueMock,
  resetPlayerSessionMock,
  togglePlayMock,
} = vi.hoisted(() => ({
  playCurrentTrackFromQueueMock: vi.fn(() => Promise.resolve()),
  resetPlayerSessionMock: vi.fn(),
  togglePlayMock: vi.fn(() => Promise.resolve()),
}));

mockNuxtImport('useAudioPlayer', (original) => () => ({
  ...original(),
  isPlaying: isPlayingMock,
  playCurrentTrackFromQueue: playCurrentTrackFromQueueMock,
  resetPlayerSession: resetPlayerSessionMock,
  togglePlay: togglePlayMock,
}));

const { deletePodcastEpisodeMock, deletePodcastMock } = vi.hoisted(() => ({
  deletePodcastEpisodeMock: vi.fn(),
  deletePodcastMock: vi.fn(),
}));

mockNuxtImport('usePodcast', (original) => () => ({
  ...original(),
  deletePodcast: deletePodcastMock,
  deletePodcastEpisode: deletePodcastEpisodeMock,
}));

describe('usePodcastCleanup', () => {
  let composable: ReturnType<typeof usePodcastCleanup>;

  beforeAll(() => {
    composable = usePodcastCleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the deletePodcastEpisodeGlobally function is called', () => {
    beforeEach(async () => {
      await composable.deletePodcastEpisodeGlobally(podcastEpisode);
    });

    it('calls the removeAllByTrackId function with the correct parameters', () => {
      expect(removeAllByTrackIdMock).toHaveBeenCalledWith(podcastEpisode.id);
    });

    it('calls the deletePodcastEpisode function with the correct parameters', () => {
      expect(deletePodcastEpisodeMock).toHaveBeenCalledWith(podcastEpisode);
    });

    it('calls the deleteBookmark function with the correct parameters', () => {
      expect(deleteBookmarkMock).toHaveBeenCalledWith(podcastEpisode.id, false);
    });

    describe('when the queueList value is an empty array', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        queueListMock.value = [];
        await composable.deletePodcastEpisodeGlobally(podcastEpisode);
      });

      it('calls the resetPlayerSession function', () => {
        expect(resetPlayerSessionMock).toHaveBeenCalled();
      });

      it('does not call the playCurrentTrackFromQueue function', () => {
        expect(playCurrentTrackFromQueueMock).not.toHaveBeenCalled();
      });
    });

    describe('when the podcast episode is the current track', () => {
      describe('when the podcast episode is paused', () => {
        beforeEach(async () => {
          vi.clearAllMocks();
          queueListMock.value = [podcastEpisode];
          await composable.deletePodcastEpisodeGlobally(podcastEpisode);
        });

        it('calls the playCurrentTrackFromQueue function', () => {
          expect(playCurrentTrackFromQueueMock).toHaveBeenCalled();
        });

        it('calls the togglePlay function', () => {
          expect(togglePlayMock).toHaveBeenCalled();
        });

        it('does not call the resetPlayerSession function', () => {
          expect(resetPlayerSessionMock).not.toHaveBeenCalled();
        });
      });

      describe('when the podcast episode is playing', () => {
        beforeEach(async () => {
          vi.clearAllMocks();
          queueListMock.value = [podcastEpisode];
          isPlayingMock.value = true;
          await composable.deletePodcastEpisodeGlobally(podcastEpisode);
        });

        afterAll(() => {
          isPlayingMock.value = false;
        });

        it('calls the playCurrentTrackFromQueue function', () => {
          expect(playCurrentTrackFromQueueMock).toHaveBeenCalled();
        });

        it('does not call the togglePlay function', () => {
          expect(togglePlayMock).not.toHaveBeenCalled();
        });

        it('does not call the resetPlayerSession function', () => {
          expect(resetPlayerSessionMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the podcast episode is not the current track', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        queueListMock.value = anotherPodcastEpisodes;
        currentTrackMock.value = queueListMock.value[0];

        await composable.deletePodcastEpisodeGlobally(podcastEpisode);
      });

      it('does not call the playCurrentTrackFromQueue function', () => {
        expect(playCurrentTrackFromQueueMock).not.toHaveBeenCalled();
      });

      it('does not call the resetPlayerSession function', () => {
        expect(resetPlayerSessionMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the deletePodcastGlobally function is called', () => {
    beforeEach(async () => {
      await composable.deletePodcastGlobally('queue-id');
    });

    it('calls the deletePodcast function with the correct parameters', () => {
      expect(deletePodcastMock).toHaveBeenCalledWith('queue-id');
    });

    it('calls the getBookmarks function', () => {
      expect(getBookmarksMock).toHaveBeenCalled();
    });

    describe('when the queueList value is an empty array', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        queueListMock.value = [];
        await composable.deletePodcastGlobally('queue-id');
      });

      it('calls the resetPlayerSession function', () => {
        expect(resetPlayerSessionMock).toHaveBeenCalled();
      });

      it('does not call the playCurrentTrackFromQueue function', () => {
        expect(playCurrentTrackFromQueueMock).not.toHaveBeenCalled();
      });

      it('does not call the removeAllByTrackId function', () => {
        expect(removeAllByTrackIdMock).not.toHaveBeenCalled();
      });
    });

    describe('when the queueList value contains tracks for the podcast', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        queueListMock.value = [...podcastQueueTracks, queueTrack];
        currentTrackMock.value = podcastEpisode;
        await composable.deletePodcastGlobally('queue-id');
      });

      it('calls the removeAllByTrackId function with the correct parameters', () => {
        expect(removeAllByTrackIdMock).toHaveBeenCalledWith(
          podcastQueueTracks[0].id,
        );
        expect(removeAllByTrackIdMock).toHaveBeenCalledWith(
          podcastQueueTracks[1].id,
        );
      });

      it('does not call the removeAllByTrackId function for a track that is not part of the podcast', () => {
        expect(removeAllByTrackIdMock).not.toHaveBeenCalledWith(queueTrack.id);
      });

      it('does not call the resetPlayerSession function', () => {
        expect(resetPlayerSessionMock).not.toHaveBeenCalled();
      });

      describe('when the podcast episode is not the current track', () => {
        it('does not call the playCurrentTrackFromQueue function', () => {
          expect(playCurrentTrackFromQueueMock).not.toHaveBeenCalled();
        });
      });

      describe('when the podcast episode is the current track', () => {
        describe('when the podcast episode is paused', () => {
          beforeEach(async () => {
            vi.clearAllMocks();
            queueListMock.value = [...podcastQueueTracks, queueTrack];
            currentTrackMock.value = podcastQueueTracks[0];
            await composable.deletePodcastGlobally('queue-id');
          });

          it('calls the playCurrentTrackFromQueue function', () => {
            expect(playCurrentTrackFromQueueMock).toHaveBeenCalled();
          });

          it('calls the togglePlay function', () => {
            expect(togglePlayMock).toHaveBeenCalled();
          });
        });

        describe('when the podcast episode is playing', () => {
          beforeEach(async () => {
            vi.clearAllMocks();
            queueListMock.value = [...podcastQueueTracks, queueTrack];
            currentTrackMock.value = podcastQueueTracks[0];
            isPlayingMock.value = true;
            await composable.deletePodcastGlobally('queue-id');
          });

          afterAll(() => {
            isPlayingMock.value = false;
          });

          it('calls the playCurrentTrackFromQueue function', () => {
            expect(playCurrentTrackFromQueueMock).toHaveBeenCalled();
          });

          it('does not call the togglePlay function', () => {
            expect(togglePlayMock).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when the current track is not from the podcast', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        queueListMock.value = [queueTrack];
        currentTrackMock.value = queueTrack;
        await composable.deletePodcastGlobally('queue-id');
      });

      it('does not call the playCurrentTrackFromQueue function', () => {
        expect(playCurrentTrackFromQueueMock).not.toHaveBeenCalled();
      });

      it('does not call the resetPlayerSession function', () => {
        expect(resetPlayerSessionMock).not.toHaveBeenCalled();
      });
    });
  });
});
