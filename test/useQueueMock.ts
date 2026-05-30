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
const restoreQueueMock = vi.fn();
const restoreQueueStateMock = vi.fn();
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
    navigateQueue: navigateQueueMock,
    originalQueueList: originalQueueListMock,
    queueList: queueListMock,
    removeTrack: removeTrackMock,
    reorderQueueTracks: reorderQueueTracksMock,
    resetQueue: resetQueueMock,
    restoreQueue: restoreQueueMock,
    restoreQueueState: restoreQueueStateMock,
    shuffleQueue: shuffleQueueMock,
    toggleQueueList: toggleQueueListMock,
    toggleQueuePlayer: toggleQueuePlayerMock,
    updateCurrentTrackPosition: updateCurrentTrackPositionMock,
    updateTrackFavourite: updateTrackFavouriteMock,
  }));

  return {
    addTracksMock,
    closeQueuePanelsMock,
    currentQueueIndexMock,
    currentTrackMock,
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
    navigateQueueMock,
    originalQueueListMock,
    queueListMock,
    removeTrackMock,
    reorderQueueTracksMock,
    resetQueueMock,
    restoreQueueMock,
    restoreQueueStateMock,
    shuffleQueueMock,
    toggleQueueListMock,
    toggleQueuePlayerMock,
    updateCurrentTrackPositionMock,
    updateTrackFavouriteMock,
  };
}
