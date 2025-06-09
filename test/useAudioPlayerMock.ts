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
const fastForwardTrackMock = vi.fn();
const hasCurrentTrackMock = ref(false);
const hasNextTrackMock = ref(false);
const hasPreviousTrackMock = ref(false);
const isBufferingMock = ref(false);
const isCurrentTrackMock = vi.fn(() => false);
const isMutedMock = ref(false);
const isPlayingMock = ref(false);
const isPodcastEpisodeMock = ref(false);
const isRadioStationMock = ref(false);
const isTrackMock = ref(false);
const playbackRateMock = ref(2);
const playCurrentTrackMock = vi.fn();
const playNextTrackMock = vi.fn();
const togglePlayMock = vi.fn();
const playPreviousTrackMock = vi.fn();
const playTrackFromQueueListMock = vi.fn();
const playTracksMock = vi.fn();
const queueListMock = ref(queueTrack);
const removeTrackFromQueueListMock = vi.fn();
const repeatMock = ref(-1);
const rewindTrackMock = vi.fn();
const setCurrentTimeMock = vi.fn();
const setPlaybackRateMock = vi.fn();
const setPlaybackRateWithIncrementMock = vi.fn();
const setRepeatMock = vi.fn();
const setVolumeMock = vi.fn();
const showMediaPlayerMock = ref(false);
const shuffleMock = ref(false);
const toggleMuteMock = vi.fn();
const toggleShuffleMock = vi.fn();
const setVolumeWithIncrementMock = vi.fn();
const updateQueueTrackFavouriteMock = vi.fn();
const volumeMock = ref(1);

export function useAudioPlayerMock() {
  mockNuxtImport('useAudioPlayer', () => () => ({
    addTracksToQueue: addTracksToQueueMock,
    addTrackToQueue: addTrackToQueueMock,
    bufferedDuration: bufferedDurationMock,
    clearQueueList: clearQueueListMock,
    currentTime: currentTimeMock,
    currentTrack: currentTrackMock,
    fastForwardTrack: fastForwardTrackMock,
    hasCurrentTrack: hasCurrentTrackMock,
    hasNextTrack: hasNextTrackMock,
    hasPreviousTrack: hasPreviousTrackMock,
    isBuffering: isBufferingMock,
    isCurrentTrack: isCurrentTrackMock,
    isMuted: isMutedMock,
    isPlaying: isPlayingMock,
    isPodcastEpisode: isPodcastEpisodeMock,
    isRadioStation: isRadioStationMock,
    isTrack: isTrackMock,
    playbackRate: playbackRateMock,
    playCurrentTrack: playCurrentTrackMock,
    playNextTrack: playNextTrackMock,
    playPreviousTrack: playPreviousTrackMock,
    playTrackFromQueueList: playTrackFromQueueListMock,
    playTracks: playTracksMock,
    queueList: queueListMock,
    removeTrackFromQueueList: removeTrackFromQueueListMock,
    repeat: repeatMock,
    rewindTrack: rewindTrackMock,
    setCurrentTime: setCurrentTimeMock,
    setPlaybackRate: setPlaybackRateMock,
    setPlaybackRateWithIncrement: setPlaybackRateWithIncrementMock,
    setRepeat: setRepeatMock,
    setVolume: setVolumeMock,
    setVolumeWithIncrement: setVolumeWithIncrementMock,
    showMediaPlayer: showMediaPlayerMock,
    shuffle: shuffleMock,
    toggleMute: toggleMuteMock,
    togglePlay: togglePlayMock,
    toggleShuffle: toggleShuffleMock,
    updateQueueTrackFavourite: updateQueueTrackFavouriteMock,
    volume: volumeMock,
  }));

  return {
    addTracksToQueueMock,
    addTrackToQueueMock,
    bufferedDurationMock,
    clearQueueListMock,
    currentTimeMock,
    currentTrackMock,
    fastForwardTrackMock,
    hasCurrentTrackMock,
    hasNextTrackMock,
    hasPreviousTrackMock,
    isBufferingMock,
    isCurrentTrackMock,
    isMutedMock,
    isPlayingMock,
    isPodcastEpisodeMock,
    isRadioStationMock,
    isTrackMock,
    playbackRateMock,
    playCurrentTrackMock,
    playNextTrackMock,
    playPreviousTrackMock,
    playTrackFromQueueListMock,
    playTracksMock,
    queueListMock,
    removeTrackFromQueueListMock,
    repeatMock,
    rewindTrackMock,
    setCurrentTimeMock,
    setPlaybackRateMock,
    setPlaybackRateWithIncrementMock,
    setRepeatMock,
    setVolumeMock,
    setVolumeWithIncrementMock,
    showMediaPlayerMock,
    shuffleMock,
    toggleMuteMock,
    togglePlayMock,
    toggleShuffleMock,
    updateQueueTrackFavouriteMock,
    volumeMock,
  };
}
