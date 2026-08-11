import { audioElementMock } from '@/test/audioElementMock';
import { getFormattedQueueTracksMock } from '@/test/helpers';

import {
  detachAudioSource,
  getPreviousTrack,
  getTracksToPreload,
  getUpcomingTracks,
  isMusicTrack,
} from './utils';

const { audioLoadMock, audioMock, removeAttributeMock } = audioElementMock();

const tracks = getFormattedQueueTracksMock(5);
const shortTracks = getFormattedQueueTracksMock(2);
const radioTracks = getFormattedQueueTracksMock(5, {
  type: MEDIA_TYPE.radioStation,
});

const noStreamUrlTracks = [
  getFormattedQueueTracksMock()[0],
  getFormattedQueueTracksMock(1, { streamUrlId: undefined })[0],
  getFormattedQueueTracksMock()[0],
];

describe('getUpcomingTracks', () => {
  describe.each([
    [tracks, 0, REPEAT_MODE.off, [tracks[1], tracks[2], tracks[3]]],
    [tracks, 3, REPEAT_MODE.off, [tracks[4]]],
    [tracks, 4, REPEAT_MODE.off, []],
    [tracks, 3, REPEAT_MODE.all, [tracks[4], tracks[0], tracks[1]]],
    [[], 0, REPEAT_MODE.off, []],
    [radioTracks, 0, REPEAT_MODE.off, []],
    [noStreamUrlTracks, 0, REPEAT_MODE.off, [noStreamUrlTracks[2]]],
    [shortTracks, 0, REPEAT_MODE.off, [shortTracks[1]]],
    [shortTracks, 0, REPEAT_MODE.all, [shortTracks[1], shortTracks[0]]],
  ])(
    'when currentIndex is %i and repeat is %s',
    (queue, currentIndex, repeat, expected) => {
      it('returns the correct response', () => {
        expect(getUpcomingTracks(queue, currentIndex, repeat)).toEqual(
          expected,
        );
      });
    },
  );
});

describe('getPreviousTrack', () => {
  describe.each([
    [tracks, 1, REPEAT_MODE.off, [tracks[0]]],
    [tracks, 0, REPEAT_MODE.off, []],
    [tracks, 0, REPEAT_MODE.all, [tracks[4]]],
    [[], 0, REPEAT_MODE.off, []],
    [radioTracks, 1, REPEAT_MODE.off, []],
    [noStreamUrlTracks, 2, REPEAT_MODE.off, []],
  ])(
    'when currentIndex is %i and repeat is %s',
    (queue, currentIndex, repeat, expected) => {
      it('returns the correct response', () => {
        expect(getPreviousTrack(queue, currentIndex, repeat)).toEqual(expected);
      });
    },
  );
});

describe('getTracksToPreload', () => {
  describe.each([
    [[], 1, REPEAT_MODE.off, []],
    [tracks, 1, REPEAT_MODE.off, [tracks[2], tracks[3], tracks[4], tracks[0]]],
    [tracks, 0, REPEAT_MODE.off, [tracks[1], tracks[2], tracks[3]]],
  ])(
    'when currentIndex is %i and repeat is %s',
    (queue, currentIndex, repeat, expected) => {
      it('returns the correct response', () => {
        expect(getTracksToPreload(queue, currentIndex, repeat)).toEqual(
          expected,
        );
      });
    },
  );
});

describe('isMusicTrack', () => {
  describe.each([
    [getFormattedQueueTracksMock()[0], true],
    [
      getFormattedQueueTracksMock(1, {
        type: MEDIA_TYPE.radioStation,
      })[0],
      false,
    ],
    [
      getFormattedQueueTracksMock(1, {
        type: MEDIA_TYPE.podcastEpisode,
      })[0],
      false,
    ],
  ])('when the value is %o', (track, expected) => {
    it('returns the correct response', () => {
      expect(isMusicTrack(track)).toBe(expected);
    });
  });
});

describe('detachAudioSource', () => {
  beforeEach(() => {
    audioMock.src = 'https://example.com/song.mp3';
    detachAudioSource(audioMock as unknown as HTMLAudioElement);
  });

  it('sets the correct src value', () => {
    expect(audioMock.src).toBe('');
  });

  it('calls the removeAttribute function with the correct parameters', () => {
    expect(removeAttributeMock).toHaveBeenCalledWith('src');
  });

  it('calls the audio load function', () => {
    expect(audioLoadMock).toHaveBeenCalled();
  });
});
