import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import {
  getFormattedBookmarksMock,
  getFormattedPodcastEpisodesMock,
  getFormattedQueueTracksMock,
  getFormattedRadioStationMock,
} from '@/test/helpers';

import { useQueue } from './index';

const bookmarksMock = ref<Bookmark[]>([]);
const getBookmarksMock = vi.hoisted(() => vi.fn());
const getBookmarkPositionMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useBookmark', () => () => ({
  bookmarks: bookmarksMock,
  getBookmarkPosition: getBookmarkPositionMock,
  getBookmarks: getBookmarksMock,
}));

const lockScrollMock = vi.fn();
const unlockScrollMock = vi.fn();

mockNuxtImport('useScrollLock', () => () => ({
  lockScroll: lockScrollMock,
  unlockScroll: unlockScrollMock,
}));

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const setLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('setLocalStorage', () => setLocalStorageMock);

const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const getLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);

const config = vi.hoisted(() => ({
  public: {
    ENABLE_QUEUE_SYNC: true,
  },
}));

mockNuxtImport('useRuntimeConfig', () => () => config);

const {
  addTracks,
  closeQueuePanels,
  currentQueueIndex,
  currentTrack,
  enrichTracksWithPositions,
  hasCurrentTrack,
  hasNextTrack,
  hasPreviousTrack,
  hasQueueTracks,
  isCurrentTrack,
  isLastTrack,
  isPodcastEpisode,
  isQueueListOpened,
  isQueuePlayerOpened,
  isRadioStation,
  isTrack,
  mergeBookmarksToCurrentQueue,
  navigateQueue,
  originalQueueSnapshot,
  queueList,
  removeTrack,
  reorderQueueTracks,
  resetQueue,
  restoreLocalState,
  shuffleQueue,
  toggleQueueList,
  toggleQueuePlayer,
  unshuffleQueue,
  updateCurrentTrackPosition,
  updateTrackFavourite,
} = useQueue();

const tracks = getFormattedQueueTracksMock(4);
const podcastEpisode = getFormattedPodcastEpisodesMock(1)[0];
const radioStation = getFormattedRadioStationMock(1)[0];
const bookmarks = getFormattedBookmarksMock(4);
const enrichedTracks = getFormattedPodcastEpisodesMock(4);

let preShuffleQueue: PlayableTrack[];

describe('useQueue', () => {
  it('sets the default isQueueListOpened value', () => {
    expect(isQueueListOpened.value).toBe(false);
  });

  it('sets the default isQueuePlayerOpened value', () => {
    expect(isQueuePlayerOpened.value).toBe(false);
  });

  it('sets the default queueList value', () => {
    expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
  });

  it('sets the default currentQueueIndex value', () => {
    expect(currentQueueIndex.value).toBe(
      QUEUE_DEFAULT_STATES.currentQueueIndex,
    );
  });

  it('sets the default originalQueueSnapshot value', () => {
    expect(originalQueueSnapshot.value).toBe(
      QUEUE_DEFAULT_STATES.originalQueueSnapshot,
    );
  });

  it('sets the correct currentTrack value', () => {
    expect(currentTrack.value).toEqual({});
  });

  it('sets the correct hasCurrentTrack value', () => {
    expect(hasCurrentTrack.value).toBe(false);
  });

  it('sets the correct hasQueueTracks value', () => {
    expect(hasQueueTracks.value).toBe(false);
  });

  it('sets the correct isLastTrack value', () => {
    expect(isLastTrack.value).toBe(true);
  });

  it('sets the correct isPodcastEpisode value', () => {
    expect(isPodcastEpisode.value).toBe(false);
  });

  it('sets the correct isRadioStation value', () => {
    expect(isRadioStation.value).toBe(false);
  });

  it('sets the correct isTrack value', () => {
    expect(isTrack.value).toBe(false);
  });

  it('sets the correct hasNextTrack value', () => {
    expect(hasNextTrack.value).toBe(false);
  });

  it('sets the correct hasPreviousTrack value', () => {
    expect(hasPreviousTrack.value).toBe(false);
  });

  describe('when the toggleQueueList function is called', () => {
    beforeAll(() => {
      toggleQueueList();
    });

    it('sets the correct isQueueListOpened value', () => {
      expect(isQueueListOpened.value).toBe(true);
    });

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when the toggleQueueList function is called again', () => {
      beforeAll(() => {
        toggleQueueList();
      });

      it('sets the correct isQueueListOpened value', () => {
        expect(isQueueListOpened.value).toBe(false);
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the toggleQueuePlayer function is called', () => {
    beforeAll(() => {
      toggleQueuePlayer();
    });

    it('sets the correct isQueuePlayerOpened value', () => {
      expect(isQueuePlayerOpened.value).toBe(true);
    });

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when the toggleQueuePlayer function is called again', () => {
      beforeAll(() => {
        toggleQueuePlayer();
      });

      it('sets the correct isQueuePlayerOpened value', () => {
        expect(isQueuePlayerOpened.value).toBe(false);
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });
    });
  });

  describe('when both queue list and player are opened', () => {
    beforeAll(() => {
      toggleQueueList();
      toggleQueuePlayer();
    });

    it('calls the lockScroll function when opening the player', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when the toggleQueueList function is called to close the list', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        toggleQueueList();
      });

      it('calls the lockScroll function', () => {
        expect(lockScrollMock).toHaveBeenCalled();
      });

      it('does not call the unlockScroll function', () => {
        expect(unlockScrollMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the closeQueuePanels function is called', () => {
    beforeAll(() => {
      closeQueuePanels();
    });

    it('sets the correct isQueueListOpened value', () => {
      expect(isQueueListOpened.value).toBe(false);
    });

    it('sets the correct isQueuePlayerOpened value', () => {
      expect(isQueuePlayerOpened.value).toBe(false);
    });

    it('calls the unlockScroll function', () => {
      expect(unlockScrollMock).toHaveBeenCalled();
    });
  });

  describe('when the addTracks function is called', () => {
    let result: ReturnType<typeof addTracks>;

    beforeAll(() => {
      result = addTracks(tracks);
    });

    it('returns the correct response', () => {
      expect(result).toBe(false);
    });

    it('adds to the queueList value', () => {
      expect(queueList.value).toEqual(tracks);
    });

    it('sets the correct hasQueueTracks value', () => {
      expect(hasQueueTracks.value).toBe(true);
    });

    it('sets the correct isLastTrack value', () => {
      expect(isLastTrack.value).toBe(false);
    });

    // Test both scenarios of ENABLE_QUEUE_SYNC in the same test to avoid
    // repeating the setup of adding tracks before each test.
    describe('when ENABLE_QUEUE_SYNC is true', () => {
      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
          {
            currentQueueIndex: QUEUE_DEFAULT_STATES.currentQueueIndex,
            originalQueueSnapshot: QUEUE_DEFAULT_STATES.originalQueueSnapshot,
            queueList: tracks,
          },
        );
      });

      it('calls the fetchData function with correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/savePlayQueue', {
          method: 'POST',
          query: {
            current: undefined,
            id: [tracks[0].id, tracks[1].id, tracks[2].id, tracks[3].id],
            position: 100,
          },
        });
      });
    });

    describe('when the queue contains only radio stations', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        addTracks([radioStation], true);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/savePlayQueue', {
          method: 'POST',
        });
      });
    });

    describe('when ENABLE_QUEUE_SYNC is false', () => {
      beforeAll(() => {
        vi.clearAllMocks();

        config.public.ENABLE_QUEUE_SYNC = false;

        const { addTracks } = useQueue();
        addTracks(tracks, true);
      });

      it('calls the setLocalStorage function with the correct parameters', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
          {
            currentQueueIndex: QUEUE_DEFAULT_STATES.currentQueueIndex,
            originalQueueSnapshot: QUEUE_DEFAULT_STATES.originalQueueSnapshot,
            queueList: tracks,
          },
        );
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });

    describe('when the addTracks function is called again', () => {
      describe('when the clearExisting param is not set', () => {
        beforeAll(() => {
          result = addTracks(tracks);
        });

        it('returns the correct response', () => {
          expect(result).toBe(true);
        });

        it('appends to the queueList value', () => {
          expect(queueList.value).toEqual([...tracks, ...tracks]);
        });
      });

      describe('when the clearExisting param is set to true', () => {
        beforeAll(() => {
          result = addTracks(tracks, true);
        });

        it('returns the correct response', () => {
          expect(result).toBe(false);
        });

        it('replaces the queueList value', () => {
          expect(queueList.value).toEqual(tracks);
        });

        it('resets the currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(
            QUEUE_DEFAULT_STATES.currentQueueIndex,
          );
        });

        it('resets the originalQueueSnapshot value', () => {
          expect(originalQueueSnapshot.value).toBe(
            QUEUE_DEFAULT_STATES.originalQueueSnapshot,
          );
        });
      });
    });
  });

  describe('when the navigateQueue function is called', () => {
    let result: ReturnType<typeof navigateQueue>;

    describe('when the target param is a number', () => {
      beforeAll(() => {
        result = navigateQueue(0);
      });

      it('returns the correct response', () => {
        expect(result).toEqual(tracks[0]);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });

      it('sets the correct currentTrack value', () => {
        expect(currentTrack.value).toEqual(tracks[0]);
      });

      it('sets the correct isLastTrack value', () => {
        expect(isLastTrack.value).toBe(false);
      });

      it('sets the correct hasNextTrack value', () => {
        expect(hasNextTrack.value).toBe(true);
      });

      it('sets the correct hasPreviousTrack value', () => {
        expect(hasPreviousTrack.value).toBe(false);
      });

      it('sets the correct isTrack value', () => {
        expect(isTrack.value).toBe(true);
      });

      it('sets the correct isPodcastEpisode value', () => {
        expect(isPodcastEpisode.value).toBe(false);
      });

      it('sets the correct isRadioStation value', () => {
        expect(isRadioStation.value).toBe(false);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe('when the target param is next', () => {
      describe('when the current track is not the last in the queue', () => {
        beforeAll(() => {
          result = navigateQueue('next');
        });

        it('returns the correct response', () => {
          expect(result).toEqual(tracks[1]);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(1);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[1]);
        });

        it('sets the correct isLastTrack value', () => {
          expect(isLastTrack.value).toBe(false);
        });

        it('sets the correct hasNextTrack value', () => {
          expect(hasNextTrack.value).toBe(true);
        });

        it('sets the correct hasPreviousTrack value', () => {
          expect(hasPreviousTrack.value).toBe(true);
        });
      });

      describe('when the current track is the second to last in the queue', () => {
        beforeAll(() => {
          navigateQueue('next');
          result = navigateQueue('next');
        });

        it('returns the correct response', () => {
          expect(result).toEqual(tracks[3]);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(3);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[3]);
        });

        it('sets the correct isLastTrack value', () => {
          expect(isLastTrack.value).toBe(true);
        });

        it('sets the correct hasNextTrack value', () => {
          expect(hasNextTrack.value).toBe(false);
        });

        it('sets the correct hasPreviousTrack value', () => {
          expect(hasPreviousTrack.value).toBe(true);
        });
      });

      describe('when the current track is the last in the queue', () => {
        beforeAll(() => {
          result = navigateQueue('next');
        });

        it('returns the correct response', () => {
          expect(result).toEqual(tracks[0]);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(0);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[0]);
        });

        it('sets the correct isLastTrack value', () => {
          expect(isLastTrack.value).toBe(false);
        });

        it('sets the correct hasNextTrack value', () => {
          expect(hasNextTrack.value).toBe(true);
        });

        it('sets the correct hasPreviousTrack value', () => {
          expect(hasPreviousTrack.value).toBe(false);
        });
      });
    });

    describe('when the target param is previous', () => {
      describe('when the current track is not the first in the queue', () => {
        beforeAll(() => {
          navigateQueue(1);
          result = navigateQueue('previous');
        });

        it('returns the correct response', () => {
          expect(result).toEqual(tracks[0]);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(0);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[0]);
        });

        it('sets the correct isLastTrack value', () => {
          expect(isLastTrack.value).toBe(false);
        });

        it('sets the correct hasNextTrack value', () => {
          expect(hasNextTrack.value).toBe(true);
        });

        it('sets the correct hasPreviousTrack value', () => {
          expect(hasPreviousTrack.value).toBe(false);
        });
      });

      describe('when the current track is the first in the queue', () => {
        beforeAll(() => {
          result = navigateQueue('previous');
        });

        it('returns the correct response', () => {
          expect(result).toEqual(tracks[3]);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(3);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[3]);
        });

        it('sets the correct isLastTrack value', () => {
          expect(isLastTrack.value).toBe(true);
        });

        it('sets the correct hasNextTrack value', () => {
          expect(hasNextTrack.value).toBe(false);
        });

        it('sets the correct hasPreviousTrack value', () => {
          expect(hasPreviousTrack.value).toBe(true);
        });
      });
    });

    describe('when the current track is a podcast episode', () => {
      beforeAll(() => {
        addTracks([podcastEpisode]);
        navigateQueue(4);
      });

      it('sets the correct isTrack value', () => {
        expect(isTrack.value).toBe(false);
      });

      it('sets the correct isPodcastEpisode value', () => {
        expect(isPodcastEpisode.value).toBe(true);
      });

      it('sets the correct isRadioStation value', () => {
        expect(isRadioStation.value).toBe(false);
      });
    });

    describe('when the current track is a radio station', () => {
      beforeAll(() => {
        addTracks([radioStation]);
        navigateQueue(5);
      });

      it('sets the correct isTrack value', () => {
        expect(isTrack.value).toBe(false);
      });

      it('sets the correct isPodcastEpisode value', () => {
        expect(isPodcastEpisode.value).toBe(false);
      });

      it('sets the correct isRadioStation value', () => {
        expect(isRadioStation.value).toBe(true);
      });
    });
  });

  describe('when the updateTrackFavourite function is called', () => {
    describe('when the track is found', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        updateTrackFavourite(tracks[0].id, true);
      });

      it('sets the correct favourite value', () => {
        expect((queueList.value[0] as Track).favourite).toBe(true);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe('when the track is not found', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        updateTrackFavourite('non-existent-id', true);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the removeTrack function is called', () => {
    let result: ReturnType<typeof removeTrack>;

    describe('when the track index does not exist in the queue', () => {
      beforeAll(() => {
        result = removeTrack(999);
      });

      it('returns the correct response', () => {
        expect(result).toBe(false);
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toHaveLength(6);
      });

      it('does not update the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(5);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when the removed track is after the current index', () => {
      beforeAll(() => {
        navigateQueue(2);
        result = removeTrack(5);
      });

      it('returns the correct response', () => {
        expect(result).toBe(false);
      });

      it('removes from the queueList value', () => {
        expect(queueList.value).toHaveLength(5);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(2);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe('when the removed track is before the current index', () => {
      beforeAll(() => {
        navigateQueue(1);
        result = removeTrack(0);
      });

      it('returns the correct response', () => {
        expect(result).toBe(false);
      });

      it('removes from the queueList value', () => {
        expect(queueList.value).toHaveLength(4);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });
    });

    describe('when the removed track is the current track', () => {
      beforeAll(() => {
        result = removeTrack(0);
      });

      it('returns the correct response', () => {
        expect(result).toBe(true);
      });

      it('removes from the queueList value', () => {
        expect(queueList.value).toHaveLength(3);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });

      it('sets the correct currentTrack value', () => {
        expect(currentTrack.value).toEqual(tracks[2]);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe('when the last track is removed', () => {
      beforeAll(() => {
        removeTrack(2);
        removeTrack(999);
        removeTrack(0);
        result = removeTrack(0);
      });

      it('returns the correct response', () => {
        expect(result).toBe(1);
      });

      it('clears the queueList value', () => {
        expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
      });

      it('clears the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(
          QUEUE_DEFAULT_STATES.currentQueueIndex,
        );
      });

      it('clears the originalQueueSnapshot value', () => {
        expect(originalQueueSnapshot.value).toBe(
          QUEUE_DEFAULT_STATES.originalQueueSnapshot,
        );
      });

      it('calls the deleteLocalStorage function with the correct parameters', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
        );
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the updateCurrentTrackPosition function is called', () => {
    describe('when there is no current track', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        updateCurrentTrackPosition(5);
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
      });

      it('does not call the setLocalStorage function', () => {
        expect(setLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when there is a current track', () => {
      beforeAll(() => {
        addTracks([radioStation]);
        navigateQueue('next');
        vi.clearAllMocks();
        updateCurrentTrackPosition(5);
      });

      afterAll(() => {
        removeTrack(0);
      });

      it('sets the position on the current track', () => {
        expect(queueList.value[currentQueueIndex.value].position).toBe(5);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
          expect.objectContaining({
            queueList: expect.arrayContaining([
              expect.objectContaining({
                position: 5,
              }),
            ]),
          }),
        );
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the reorderQueueTracks function is called', () => {
    describe('when moving the selected active track forward', () => {
      beforeAll(() => {
        addTracks(tracks);
        navigateQueue(0);
        reorderQueueTracks(0, 2);
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[1],
          tracks[2],
          tracks[0],
          tracks[3],
        ]);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(2);
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });
    });

    describe('when moving the selected track backward', () => {
      beforeAll(() => {
        reorderQueueTracks(3, 1);
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[1],
          tracks[3],
          tracks[2],
          tracks[0],
        ]);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(3);
      });
    });

    describe('when moving the selected track from before to after active track', () => {
      beforeAll(() => {
        reorderQueueTracks(0, 2);
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[3],
          tracks[2],
          tracks[1],
          tracks[0],
        ]);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(3);
      });
    });

    describe('when moving the selected track from after to before active track', () => {
      beforeAll(() => {
        reorderQueueTracks(3, 0);
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[0],
          tracks[3],
          tracks[2],
          tracks[1],
        ]);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });
    });

    describe('when the provided indices are equal', () => {
      beforeAll(() => {
        reorderQueueTracks(1, 1);
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[0],
          tracks[3],
          tracks[2],
          tracks[1],
        ]);
      });

      it('does not update the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });
    });

    describe('when an invalid fromIndex is provided', () => {
      beforeAll(() => {
        reorderQueueTracks(-1, 0);
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[0],
          tracks[3],
          tracks[2],
          tracks[1],
        ]);
      });

      it('does not update the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });
    });

    describe('when an invalid toIndex is provided', () => {
      beforeAll(() => {
        reorderQueueTracks(0, 5);
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toEqual([
          tracks[0],
          tracks[3],
          tracks[2],
          tracks[1],
        ]);
      });

      it('does not update the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(0);
      });
    });
  });

  describe('when the shuffleQueue function is called', () => {
    beforeAll(() => {
      addTracks(tracks, true);
      navigateQueue(2);
      preShuffleQueue = [...queueList.value];
      shuffleQueue();
    });

    it('sets the correct currentQueueIndex value', () => {
      expect(currentQueueIndex.value).toBe(0);
    });

    it('sets the correct previously current track as the first in the queue', () => {
      expect(queueList.value[0]).toEqual(tracks[2]);
    });

    it('sets the correct originalQueueSnapshot value', () => {
      expect(originalQueueSnapshot.value).toBe(JSON.stringify(preShuffleQueue));
    });

    it('calls the setLocalStorage function', () => {
      expect(setLocalStorageMock).toHaveBeenCalled();
    });
  });

  describe('when the unshuffleQueue function is called', () => {
    describe('when the originalQueueSnapshot value has a set value', () => {
      beforeAll(() => {
        unshuffleQueue();
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual(preShuffleQueue);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(2);
      });

      it('clears the originalQueueSnapshot value', () => {
        expect(originalQueueSnapshot.value).toBe(
          QUEUE_DEFAULT_STATES.originalQueueSnapshot,
        );
      });

      it('calls the setLocalStorage function', () => {
        expect(setLocalStorageMock).toHaveBeenCalled();
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/savePlayQueue', {
          method: 'POST',
        });
      });
    });

    describe('when the originalQueueSnapshot value is an empty string', () => {
      describe('when localStorage has a saved originalQueueSnapshot', () => {
        beforeAll(() => {
          // originalQueueSnapshot cleared in previous test.
          vi.clearAllMocks();

          getLocalStorageMock.mockReturnValue({
            currentQueueIndex: 1,
            originalQueueSnapshot: JSON.stringify(tracks),
            queueList: tracks,
          });

          unshuffleQueue();
        });

        it('restores the queueList from the localStorage snapshot', () => {
          expect(queueList.value).toEqual(tracks);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(2);
        });

        it('clears the originalQueueSnapshot value', () => {
          expect(originalQueueSnapshot.value).toBe(
            QUEUE_DEFAULT_STATES.originalQueueSnapshot,
          );
        });
      });

      describe('when localStorage does not have a saved originalQueueSnapshot', () => {
        beforeAll(() => {
          getLocalStorageMock.mockReturnValue(null);
          unshuffleQueue();
        });

        it('does not update the queueList value', () => {
          expect(queueList.value).toEqual(tracks);
        });
      });
    });
  });

  describe('when the resetQueue function is called', () => {
    describe('when the syncServer parameter is true', () => {
      beforeAll(() => {
        resetQueue();
      });

      it('clears the queueList value', () => {
        expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
      });

      it('clears the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(
          QUEUE_DEFAULT_STATES.currentQueueIndex,
        );
      });

      it('clears the originalQueueSnapshot value', () => {
        expect(originalQueueSnapshot.value).toBe(
          QUEUE_DEFAULT_STATES.originalQueueSnapshot,
        );
      });

      it('calls the deleteLocalStorage function with the correct parameters', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
        );
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });

      it('calls the fetchData function with correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/savePlayQueue', {
          method: 'POST',
        });
      });
    });

    describe('when the syncServer parameter is false', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        addTracks(tracks, true);
        resetQueue(false);
      });

      it('clears the queueList value', () => {
        expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
      });

      it('calls the deleteLocalStorage function with the correct parameters', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
        );
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith('/savePlayQueue', {
          method: 'POST',
        });
      });
    });
  });

  describe('when the restoreQueueStateFromLocal function is called', () => {
    let restoreQueueStateFromLocalResult: ReturnType<
      typeof useQueue
    >['restoreQueueStateFromLocal'];

    beforeAll(() => {
      config.public.ENABLE_QUEUE_SYNC = false;
      const queue = useQueue();
      restoreQueueStateFromLocalResult = queue.restoreQueueStateFromLocal;
    });

    describe('when getLocalStorage returns null', () => {
      beforeAll(() => {
        resetQueue(false); // reset queueStateRestored
        getLocalStorageMock.mockReturnValue(null);
        restoreQueueStateFromLocalResult();
      });

      it('calls the getLocalStorage function with the correct parameters', () => {
        expect(getLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
        );
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
      });

      it('does not update the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(
          QUEUE_DEFAULT_STATES.currentQueueIndex,
        );
      });
    });

    describe('when getLocalStorage returns a value', () => {
      beforeAll(() => {
        resetQueue(false); // reset queueStateRestored so restore runs
        getLocalStorageMock.mockReturnValue({
          currentQueueIndex: 1,
          originalQueueSnapshot: QUEUE_DEFAULT_STATES.originalQueueSnapshot,
          queueList: tracks,
        });
        restoreQueueStateFromLocalResult();
      });

      it('calls the getLocalStorage function with the correct parameters', () => {
        expect(getLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.queue,
        );
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual(tracks);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(1);
      });
    });

    describe('when ENABLE_QUEUE_SYNC is true', () => {
      beforeAll(() => {
        vi.clearAllMocks();
        config.public.ENABLE_QUEUE_SYNC = true;
        const { restoreQueueStateFromLocal } = useQueue();
        restoreQueueStateFromLocal();
      });

      afterAll(() => {
        config.public.ENABLE_QUEUE_SYNC = false; // restore for "called again" test
      });

      it('does not call the getLocalStorage function', () => {
        expect(getLocalStorageMock).not.toHaveBeenCalled();
      });
    });

    describe('when the restoreQueueStateFromLocal function is called again', () => {
      // ENABLE_QUEUE_SYNC = false here (restored by afterAll above)
      // queueStateRestored = true from the "returns a value" block — tests the idempotency guard
      beforeAll(() => {
        vi.clearAllMocks();
        restoreQueueStateFromLocalResult();
      });

      it('does not call the getLocalStorage function', () => {
        expect(getLocalStorageMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the restoreQueueStateFromServer function is called', () => {
    let restoreQueueStateFromServerResult: ReturnType<
      typeof useQueue
    >['restoreQueueStateFromServer'];

    beforeAll(() => {
      config.public.ENABLE_QUEUE_SYNC = true;
      const queue = useQueue();
      restoreQueueStateFromServerResult = queue.restoreQueueStateFromServer;
    });

    describe('when fetchData response returns null', () => {
      beforeAll(async () => {
        resetQueue(false); // avoid polluting fetchDataMock with syncToServer call
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await restoreQueueStateFromServerResult();
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getPlayQueue', {
          transform: expect.any(Function),
        });
      });

      it('does not update the queueList value', () => {
        expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
      });

      it('does not update the currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(
          QUEUE_DEFAULT_STATES.currentQueueIndex,
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeAll(async () => {
        resetQueue(false);
        fetchDataMock.mockResolvedValue({
          data: {
            current: tracks[2].id,
            position: 5000,
            tracks,
          },
        });

        await restoreQueueStateFromServerResult();
      });

      it('sets the correct queueList value', () => {
        expect(queueList.value).toEqual(tracks);
      });

      it('sets the correct currentQueueIndex value', () => {
        expect(currentQueueIndex.value).toBe(2);
      });

      it('sets the correct position on the current track', () => {
        expect(queueList.value[2].position).toBe(5);
      });

      describe('when the current value is not found', () => {
        beforeAll(async () => {
          vi.clearAllMocks();

          resetQueue(false);
          fetchDataMock.mockResolvedValue({
            data: {
              current: 'non-existent-id',
              position: 5000,
              tracks,
            },
          });

          await restoreQueueStateFromServerResult();
        });

        it('sets the currentQueueIndex value to the default value', () => {
          expect(currentQueueIndex.value).toBe(0);
        });
      });

      describe('when the tracks array is empty', () => {
        beforeAll(async () => {
          vi.clearAllMocks();
          resetQueue(false);
          fetchDataMock.mockResolvedValue({
            data: {
              tracks: [],
            },
          });
          await restoreQueueStateFromServerResult();
        });

        it('does not update the queueList value', () => {
          expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
        });
      });
    });

    describe('when ENABLE_QUEUE_SYNC is false', () => {
      beforeAll(async () => {
        vi.clearAllMocks();
        config.public.ENABLE_QUEUE_SYNC = false;

        const { restoreQueueStateFromServer } = useQueue();
        await restoreQueueStateFromServer();
      });

      afterAll(() => {
        config.public.ENABLE_QUEUE_SYNC = true; // restore for "called again" test
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });

    describe('when the restoreQueueStateFromServer function is called again', () => {
      // ENABLE_QUEUE_SYNC = true here (restored by afterAll above)
      // queueStateRestored = true from last successful call — tests the idempotency guard
      beforeAll(async () => {
        vi.clearAllMocks();
        await restoreQueueStateFromServerResult();
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the restoreLocalState function is called', () => {
    describe('when getLocalStorage returns null', () => {
      beforeAll(() => {
        addTracks(tracks);
        vi.clearAllMocks();
        getLocalStorageMock.mockReturnValue(null);
        restoreLocalState();
      });

      it('does not update the originalQueueSnapshot value', () => {
        expect(originalQueueSnapshot.value).toBe(
          QUEUE_DEFAULT_STATES.originalQueueSnapshot,
        );
      });

      it('does not update the queueList value track positions', () => {
        expect(queueList.value[0].position).toBe(5);
        expect(queueList.value[2].position).toBe(5);
      });
    });

    describe('when getLocalStorage returns a value', () => {
      const jsonStringfiedTracks = JSON.stringify(tracks);

      describe('when the queueList contains matching tracks', () => {
        beforeAll(() => {
          vi.clearAllMocks();

          getLocalStorageMock.mockReturnValue({
            originalQueueSnapshot: jsonStringfiedTracks,
            queueList: [
              {
                id: tracks[0].id,
                position: 45,
              },
              {
                id: tracks[1].id,
                position: 20,
              },
              {
                id: tracks[2].id,
                position: 120,
              },
              {
                id: tracks[3].id,
                position: 430,
              },
            ],
          });

          restoreLocalState();
        });

        it('updates the positions of the matching tracks in the queueList value', () => {
          expect(queueList.value[0].position).toBe(45);
          expect(queueList.value[1].position).toBe(20);
          expect(queueList.value[2].position).toBe(120);
          expect(queueList.value[3].position).toBe(430);
        });

        it('sets the correct originalQueueSnapshot value', () => {
          expect(originalQueueSnapshot.value).toBe(jsonStringfiedTracks);
        });
      });

      describe('when the queueList contains tracks that do not match the current queue', () => {
        beforeAll(() => {
          getLocalStorageMock.mockReturnValue({
            originalQueueSnapshot: [],
            queueList: [
              {
                id: 'unknown-track',
                position: 99,
              },
            ],
          });

          restoreLocalState();
        });

        it('does not update the positions of the matching tracks in the queueList value', () => {
          expect(queueList.value[0].position).toBe(45);
          expect(queueList.value[1].position).toBe(20);
          expect(queueList.value[2].position).toBe(120);
          expect(queueList.value[3].position).toBe(430);
        });
      });
    });
  });

  describe('when the enrichTracksWithPositions function is called', () => {
    describe(`when the tracks are not ${MEDIA_TYPE.podcastEpisode}`, () => {
      beforeAll(async () => {
        await enrichTracksWithPositions(tracks);
      });

      it('does not call the getBookmarks function', () => {
        expect(getBookmarksMock).not.toHaveBeenCalled();
      });
    });

    describe(`when the tracks are ${MEDIA_TYPE.podcastEpisode}`, () => {
      describe('when the bookmarks list is empty', () => {
        beforeAll(async () => {
          await enrichTracksWithPositions(enrichedTracks);
        });

        it('calls the getBookmarks function', () => {
          expect(getBookmarksMock).toHaveBeenCalledTimes(1);
        });
      });

      describe('when the bookmarks list is not empty', () => {
        beforeAll(async () => {
          vi.clearAllMocks();
          bookmarksMock.value = bookmarks;
          await enrichTracksWithPositions(enrichedTracks);
        });

        it('does not call the getBookmarks function', () => {
          expect(getBookmarksMock).not.toHaveBeenCalled();
        });
      });

      describe('when a track has a valid position in the queue list', () => {
        beforeAll(async () => {
          queueList.value = [
            {
              ...enrichedTracks[0],
              position: 12,
            },
            {
              ...enrichedTracks[0],
              position: 42,
            },
            {
              ...enrichedTracks[0],
              position: 5,
            },
          ];

          await enrichTracksWithPositions(enrichedTracks);
        });

        it('sets the track position to the maximum value found in the queue', () => {
          expect(enrichedTracks[0].position).toBe(42);
        });
      });

      describe('when a track position in the queueList value is 0 or missing', () => {
        describe('when the track has a saved bookmark position', () => {
          beforeAll(async () => {
            getBookmarkPositionMock.mockReturnValue(45);
            await enrichTracksWithPositions([enrichedTracks[1]]);
          });

          it('sets the track position to the bookmark position', () => {
            expect(enrichedTracks[1].position).toBe(45);
          });
        });

        describe('when the track does not have a saved bookmark position', () => {
          beforeAll(async () => {
            getBookmarkPositionMock.mockReturnValue(0);
            await enrichTracksWithPositions([enrichedTracks[2]]);
          });

          it('does not update the track position', () => {
            expect(enrichedTracks[2].position).toBe(undefined);
          });
        });
      });
    });
  });

  describe('when the mergeBookmarksToCurrentQueue function is called', () => {
    beforeAll(async () => {
      resetQueue();
      mergeBookmarksToCurrentQueue();
    });

    it('calls the setLocalStorage function with the correct parameters', () => {
      expect(setLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.queue,
        {
          currentQueueIndex: QUEUE_DEFAULT_STATES.currentQueueIndex,
          originalQueueSnapshot: QUEUE_DEFAULT_STATES.originalQueueSnapshot,
          queueList: [],
        },
      );
    });
  });

  describe('when the isCurrentTrack function is called', () => {
    beforeAll(() => {
      addTracks(tracks, true);
      navigateQueue(0);
    });

    describe('when the provided id matches the current track id', () => {
      it('returns the correct response', () => {
        expect(isCurrentTrack(tracks[0].id)).toBe(true);
      });
    });

    describe('when the provided id does not match the current track id', () => {
      it('returns the correct response', () => {
        expect(isCurrentTrack('non-existent-id')).toBe(false);
      });
    });
  });
});
