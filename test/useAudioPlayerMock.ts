import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { vi } from 'vitest';

const addTracksToQueueMock = vi.fn();
const addTrackToQueueMock = vi.fn();
const bufferedDurationMock = ref(2);
const currentTimeMock = ref(0);
const fastForwardTrackMock = vi.fn();
const hasNextTrackMock = ref(false);
const hasPreviousTrackMock = ref(false);
const isBufferingMock = ref(false);
const isMutedMock = ref(false);
const isPlayingMock = ref(false);
const playbackRateMock = ref(2);
const playNextTrackMock = vi.fn();
const togglePlayMock = vi.fn();
const playPreviousTrackMock = vi.fn();
const playFromQueueMock = vi.fn();
const playTracksMock = vi.fn();
const removeFromQueueMock = vi.fn();
const reorderQueueTrackMock = vi.fn();
const repeatMock = ref(-1);
const resetAudioPlayerMock = vi.fn();
const resetPlayerSessionMock = vi.fn();
const restoreAudioPlayerStateMock = vi.fn();
const rewindTrackMock = vi.fn();
const seekToMock = vi.fn();
const setPlaybackRateMock = vi.fn();
const setPlaybackRateWithIncrementMock = vi.fn();
const cycleRepeatMock = vi.fn();
const setVolumeMock = vi.fn();
const shuffleMock = ref(false);
const shuffleTracksMock = vi.fn();
const toggleMuteMock = vi.fn();
const toggleShuffleMock = vi.fn();
const setVolumeWithIncrementMock = vi.fn();
const volumeMock = ref(1);

export function useAudioPlayerMock() {
  mockNuxtImport('useAudioPlayer', () => () => ({
    addTracksToQueue: addTracksToQueueMock,
    addTrackToQueue: addTrackToQueueMock,
    bufferedDuration: bufferedDurationMock,
    canPlayNext: hasNextTrackMock,
    canPlayPrevious: hasPreviousTrackMock,
    currentTime: currentTimeMock,
    cycleRepeat: cycleRepeatMock,
    fastForwardTrack: fastForwardTrackMock,
    isBuffering: isBufferingMock,
    isMuted: isMutedMock,
    isPlaying: isPlayingMock,
    playbackRate: playbackRateMock,
    playFromQueue: playFromQueueMock,
    playNextTrack: playNextTrackMock,
    playPreviousTrack: playPreviousTrackMock,
    playTracks: playTracksMock,
    playTracksShuffled: shuffleTracksMock,
    removeFromQueue: removeFromQueueMock,
    reorderQueueTrack: reorderQueueTrackMock,
    repeat: repeatMock,
    resetAudioPlayer: resetAudioPlayerMock,
    resetPlayerSession: resetPlayerSessionMock,
    restoreAudioPlayerState: restoreAudioPlayerStateMock,
    rewindTrack: rewindTrackMock,
    seekTo: seekToMock,
    setPlaybackRate: setPlaybackRateMock,
    setPlaybackRateWithIncrement: setPlaybackRateWithIncrementMock,
    setVolume: setVolumeMock,
    setVolumeWithIncrement: setVolumeWithIncrementMock,
    shuffle: shuffleMock,
    toggleMute: toggleMuteMock,
    togglePlay: togglePlayMock,
    toggleShuffle: toggleShuffleMock,
    volume: volumeMock,
  }));

  return {
    addTracksToQueueMock,
    addTrackToQueueMock,
    bufferedDurationMock,
    currentTimeMock,
    cycleRepeatMock,
    fastForwardTrackMock,
    hasNextTrackMock,
    hasPreviousTrackMock,
    isBufferingMock,
    isMutedMock,
    isPlayingMock,
    playbackRateMock,
    playFromQueueMock,
    playNextTrackMock,
    playPreviousTrackMock,
    playTracksMock,
    removeFromQueueMock,
    reorderQueueTrackMock,
    repeatMock,
    resetAudioPlayerMock,
    resetPlayerSessionMock,
    restoreAudioPlayerStateMock,
    rewindTrackMock,
    seekToMock,
    setPlaybackRateMock,
    setPlaybackRateWithIncrementMock,
    setVolumeMock,
    setVolumeWithIncrementMock,
    shuffleMock,
    shuffleTracksMock,
    toggleMuteMock,
    togglePlayMock,
    toggleShuffleMock,
    volumeMock,
  };
}
