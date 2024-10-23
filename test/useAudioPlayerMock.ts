import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { vi } from 'vitest';

import { getFormattedQueueTracksMock } from './helpers';

const queueTrack = getFormattedQueueTracksMock();

const addTrackToQueueMock = vi.fn();
const addTracksToQueueMock = vi.fn();
const bufferedDurationMock = ref(2);
const clearQueueListMock = vi.fn();
const currentTimeMock = ref(0);
const currentTrackMock = ref(queueTrack[0]);
const durationMock = ref(0);
const fastForwardTrackMock = vi.fn();
const hasNextTrackMock = ref(false);
const hasPreviousTrackMock = ref(false);
const isCurrentTrackMock = vi.fn(() => false);
const isMutedMock = ref(false);
const isPodcastMock = ref(false);
const isRadioStationMock = ref(false);
const isTrackMock = ref(false);
const playBackRateMock = ref(1);
const playCurrentTrackMock = vi.fn();
const playNextTrackMock = vi.fn();
const togglePlayMock = vi.fn();
const playPreviousTrackMock = vi.fn();
const playTracksMock = vi.fn();
const queueListMock = ref(queueTrack);
const removeTrackFromQueueListMock = vi.fn();
const repeatMock = ref(-1);
const rewindTrackMock = vi.fn();
const setCurrentTimeMock = vi.fn();
const setPlaybackRateMock = vi.fn();
const setRepeatMock = vi.fn();
const setVolumeMock = vi.fn();
const showMediaPlayerMock = ref(false);
const shuffleMock = ref(false);
const toggleShuffleMock = vi.fn();
const toggleVolumeMock = vi.fn();
const trackIsPlayingMock = ref(false);
const trackIsBufferingMock = ref(false);
const volumeMock = ref(1);

export function useAudioPlayerMock() {
  mockNuxtImport('useAudioPlayer', () => () => ({
    addTracksToQueue: addTracksToQueueMock,
    addTrackToQueue: addTrackToQueueMock,
    bufferedDuration: bufferedDurationMock,
    clearQueueList: clearQueueListMock,
    currentTime: currentTimeMock,
    currentTrack: currentTrackMock,
    duration: durationMock,
    fastForwardTrack: fastForwardTrackMock,
    hasNextTrack: hasNextTrackMock,
    hasPreviousTrack: hasPreviousTrackMock,
    isCurrentTrack: isCurrentTrackMock,
    isMuted: isMutedMock,
    isPodcast: isPodcastMock,
    isRadioStation: isRadioStationMock,
    isTrack: isTrackMock,
    playBackRate: playBackRateMock,
    playCurrentTrack: playCurrentTrackMock,
    playNextTrack: playNextTrackMock,
    playPreviousTrack: playPreviousTrackMock,
    playTracks: playTracksMock,
    queueList: queueListMock,
    removeTrackFromQueueList: removeTrackFromQueueListMock,
    repeat: repeatMock,
    rewindTrack: rewindTrackMock,
    setCurrentTime: setCurrentTimeMock,
    setPlaybackRate: setPlaybackRateMock,
    setRepeat: setRepeatMock,
    setVolume: setVolumeMock,
    showMediaPlayer: showMediaPlayerMock,
    shuffle: shuffleMock,
    togglePlay: togglePlayMock,
    toggleShuffle: toggleShuffleMock,
    toggleVolume: toggleVolumeMock,
    trackIsBuffering: trackIsBufferingMock,
    trackIsPlaying: trackIsPlayingMock,
    volume: volumeMock,
  }));

  return {
    addTracksToQueueMock,
    addTrackToQueueMock,
    bufferedDurationMock,
    clearQueueListMock,
    currentTimeMock,
    currentTrackMock,
    durationMock,
    fastForwardTrackMock,
    hasNextTrackMock,
    hasPreviousTrackMock,
    isCurrentTrackMock,
    isMutedMock,
    isPodcastMock,
    isRadioStationMock,
    isTrackMock,
    playBackRateMock,
    playCurrentTrackMock,
    playNextTrackMock,
    playPreviousTrackMock,
    playTracksMock,
    queueListMock,
    removeTrackFromQueueListMock,
    repeatMock,
    rewindTrackMock,
    setCurrentTimeMock,
    setPlaybackRateMock,
    setRepeatMock,
    setVolumeMock,
    showMediaPlayerMock,
    shuffleMock,
    togglePlayMock,
    toggleShuffleMock,
    toggleVolumeMock,
    trackIsBufferingMock,
    trackIsPlayingMock,
    volumeMock,
  };
}
