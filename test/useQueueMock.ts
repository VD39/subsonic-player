import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { vi } from 'vitest';

import { getFormattedQueueTracksMock } from './helpers';

const addTracksMock = vi.fn().mockImplementation((tracks) => {
  queueListMock.value = [];
  queueListMock.value.push(...tracks);

  return true;
});
const closeQueuePanelsMock = vi.fn();
const currentQueueIndexMock = ref(0);
const currentTrackMock = ref(getFormattedQueueTracksMock()[0]);
const enrichTracksWithPositionsMock = vi.fn();
const hasCurrentTrackMock = ref(false);
const hasNextTrackMock = ref(false);
const hasPreviousTrackMock = ref(false);
const hasQueueTracksMock = ref(false);
const isCurrentTrackMock = vi.fn();
const isLastTrackMock = ref(false);
const isPodcastEpisodeMock = ref(false);
const isQueueListOpenedMock = ref(false);
const isQueuePlayerOpenedMock = ref(false);
const isRadioStationMock = ref(false);
const isTrackMock = ref(false);
const loadQueueStateMock = vi.fn();
const mergeBookmarksToCurrentQueueMock = vi.fn();
const navigateQueueMock = vi.fn();
const originalQueueListMock = ref([]);
const queueListMock = ref(getFormattedQueueTracksMock(5));
const removeTrackMock = vi.fn();
const reorderQueueTracksMock = vi.fn();
const resetQueueMock = vi.fn().mockImplementation(() => {
  queueListMock.value = [];
  currentQueueIndexMock.value = 0;
  originalQueueListMock.value = [];
});
const unshuffleQueueMock = vi.fn();
const restoreLocalStateMock = vi.fn();
const restoreQueueStateFromLocalMock = vi.fn();
const restoreQueueStateFromServerMock = vi.fn();
const shuffleQueueMock = vi.fn();
const toggleQueueListMock = vi.fn();
const toggleQueuePlayerMock = vi.fn();
const updateCurrentTrackPositionMock = vi.fn();
const updateTrackFavouriteMock = vi.fn();

export function useQueueMock() {
  mockNuxtImport('useQueue', () => () => ({
    addTracks: addTracksMock,
    closeQueuePanels: closeQueuePanelsMock,
    currentQueueIndex: currentQueueIndexMock,
    currentTrack: currentTrackMock,
    enrichTracksWithPositions: enrichTracksWithPositionsMock,
    hasCurrentTrack: hasCurrentTrackMock,
    hasNextTrack: hasNextTrackMock,
    hasPreviousTrack: hasPreviousTrackMock,
    hasQueueTracks: hasQueueTracksMock,
    isCurrentTrack: isCurrentTrackMock,
    isLastTrack: isLastTrackMock,
    isPodcastEpisode: isPodcastEpisodeMock,
    isQueueListOpened: isQueueListOpenedMock,
    isQueuePlayerOpened: isQueuePlayerOpenedMock,
    isRadioStation: isRadioStationMock,
    isTrack: isTrackMock,
    loadQueueState: loadQueueStateMock,
    mergeBookmarksToCurrentQueue: mergeBookmarksToCurrentQueueMock,
    navigateQueue: navigateQueueMock,
    originalQueueList: originalQueueListMock,
    queueList: queueListMock,
    removeTrack: removeTrackMock,
    reorderQueueTracks: reorderQueueTracksMock,
    resetQueue: resetQueueMock,
    restoreLocalState: restoreLocalStateMock,
    restoreQueueStateFromLocal: restoreQueueStateFromLocalMock,
    restoreQueueStateFromServer: restoreQueueStateFromServerMock,
    shuffleQueue: shuffleQueueMock,
    toggleQueueList: toggleQueueListMock,
    toggleQueuePlayer: toggleQueuePlayerMock,
    unshuffleQueue: unshuffleQueueMock,
    updateCurrentTrackPosition: updateCurrentTrackPositionMock,
    updateTrackFavourite: updateTrackFavouriteMock,
  }));

  return {
    addTracksMock,
    closeQueuePanelsMock,
    currentQueueIndexMock,
    currentTrackMock,
    enrichTracksWithPositionsMock,
    hasCurrentTrackMock,
    hasNextTrackMock,
    hasPreviousTrackMock,
    hasQueueTracksMock,
    isCurrentTrackMock,
    isLastTrackMock,
    isPodcastEpisodeMock,
    isQueueListOpenedMock,
    isQueuePlayerOpenedMock,
    isRadioStationMock,
    isTrackMock,
    loadQueueStateMock,
    mergeBookmarksToCurrentQueueMock,
    navigateQueueMock,
    originalQueueListMock,
    queueListMock,
    removeTrackMock,
    reorderQueueTracksMock,
    resetQueueMock,
    restoreLocalStateMock,
    restoreQueueStateFromLocalMock,
    restoreQueueStateFromServerMock,
    shuffleQueueMock,
    toggleQueueListMock,
    toggleQueuePlayerMock,
    unshuffleQueueMock,
    updateCurrentTrackPositionMock,
    updateTrackFavouriteMock,
  };
}
