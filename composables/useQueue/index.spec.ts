import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import {
  getFormattedPodcastEpisodesMock,
  getFormattedQueueTracksMock,
  getFormattedRadioStationMock,
} from '@/test/helpers';

import { useQueue } from './index';

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
  loadFromServer,
  navigateQueue,
  originalQueueSnapshot,
  queueList,
  removeTrack,
  reorderTrack,
  resetQueue,
  restoreQueue,
  shuffleQueue,
  toggleQueueList,
  toggleQueuePlayer,
  updateCurrentTrackPosition,
  updateTrackFavourite,
} = useQueue();

const tracks = getFormattedQueueTracksMock(4);
const podcastEpisode = getFormattedPodcastEpisodesMock(1)[0];
const radioStation = getFormattedRadioStationMock(1)[0];

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
            position: 0,
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
        config.public.ENABLE_QUEUE_SYNC = false;
        vi.clearAllMocks();

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

  describe('when the updateCurrentTrackPosition function is called', () => {
    beforeAll(() => {
      vi.clearAllMocks();
      // Radio station.
      updateCurrentTrackPosition(5);
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

    describe('when the track id does not exist in the queue', () => {
      beforeAll(() => {
        result = removeTrack('non-existent-id');
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
        result = removeTrack(radioStation.id);
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
        result = removeTrack(tracks[0].id);
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
        result = removeTrack(tracks[1].id);
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
        removeTrack(podcastEpisode.id);
        removeTrack(tracks[1].id);
        removeTrack(tracks[2].id);
        result = removeTrack(tracks[3].id);
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

  describe('when the reorderTrack function is called', () => {
    describe('when moving the selected active track forward', () => {
      beforeAll(() => {
        addTracks(tracks);
        navigateQueue(0);
        reorderTrack(0, 2);
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
        reorderTrack(3, 1);
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
        reorderTrack(0, 2);
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
        reorderTrack(3, 0);
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
        reorderTrack(1, 1);
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
        reorderTrack(-1, 0);
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
        reorderTrack(0, 5);
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

  describe('when the restoreQueue function is called', () => {
    beforeAll(() => {
      restoreQueue();
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

  describe('when the resetQueue function is called', () => {
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

  describe('when the loadFromServer function is called', () => {
    describe('when ENABLE_QUEUE_SYNC is true', () => {
      describe('when the server returns no tracks', () => {
        beforeAll(async () => {
          fetchDataMock.mockReturnValue({
            data: null,
          });

          await loadFromServer();
        });

        it('does not update the queueList value', () => {
          expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
        });
      });

      describe('when the server returns tracks with a matching current track', () => {
        beforeAll(async () => {
          fetchDataMock.mockReturnValueOnce({
            data: {
              current: tracks[3].id,
              position: 1000,
              tracks,
            },
          });

          await loadFromServer();
        });

        it('sets the correct position on the current track', () => {
          expect(queueList.value[3].position).toBe(1);
        });

        it('sets the correct queueList value', () => {
          expect(queueList.value).toEqual(tracks);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(3);
        });
      });

      describe('when the server returns tracks without a matching current track', () => {
        beforeAll(async () => {
          fetchDataMock.mockReturnValueOnce({
            data: {
              current: 'non-existent-id',
              position: 1000,
              tracks,
            },
          });

          await loadFromServer();
        });

        it('sets the correct position on the first track', () => {
          expect(queueList.value[0].position).toBe(1);
        });

        it('sets the correct queueList value', () => {
          expect(queueList.value).toEqual(tracks);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(0);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[0]);
        });
      });

      describe('when the server returns tracks without a current track', () => {
        beforeAll(async () => {
          fetchDataMock.mockReturnValueOnce({
            data: {
              position: 1000,
              tracks,
            },
          });

          await loadFromServer();
        });

        it('sets the correct position on the first track', () => {
          expect(queueList.value[0].position).toBe(1);
        });

        it('sets the correct queueList value', () => {
          expect(queueList.value).toEqual(tracks);
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(0);
        });

        it('sets the correct currentTrack value', () => {
          expect(currentTrack.value).toEqual(tracks[0]);
        });
      });
    });

    describe('when ENABLE_QUEUE_SYNC is false', () => {
      beforeAll(async () => {
        config.public.ENABLE_QUEUE_SYNC = false;
        vi.clearAllMocks();

        const { loadFromServer } = useQueue();
        await loadFromServer();
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });

      describe('when the getLocalStorage function returns null', () => {
        beforeAll(() => {
          getLocalStorageMock.mockReturnValue(null);

          const { loadFromServer } = useQueue();
          loadFromServer();
        });

        it('does not update the currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(-1);
        });

        it('does not update the queueList value', () => {
          expect(queueList.value).toEqual(QUEUE_DEFAULT_STATES.queueList);
        });
      });

      describe('when the getLocalStorage function returns saved state', () => {
        beforeAll(() => {
          getLocalStorageMock.mockReturnValue({
            currentQueueIndex: 3,
            originalQueueSnapshot: JSON.stringify(tracks),
            queueList: tracks,
          });

          const { loadFromServer } = useQueue();
          loadFromServer();
        });

        it('sets the correct currentQueueIndex value', () => {
          expect(currentQueueIndex.value).toBe(3);
        });

        it('sets the correct originalQueueSnapshot value', () => {
          expect(originalQueueSnapshot.value).toEqual(JSON.stringify(tracks));
        });

        it('sets the correct queueList value', () => {
          expect(queueList.value).toEqual(tracks);
        });
      });
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
