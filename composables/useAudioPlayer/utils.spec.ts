import { getFormattedQueueTracksMock } from '@/test/helpers';

import {
  getPreviousTracks,
  getTracksToPreload,
  getUpcomingTracks,
  pruneOriginalQueue,
  shuffleTrackInQueue,
} from './utils';

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

describe('shuffleTrackInQueue', () => {
  describe.each([[undefined], [1], [2]])('when index is %s', (index) => {
    it('sets the correct index as the first array item', () => {
      expect(shuffleTrackInQueue([...tracks], index)[0]).toEqual(
        tracks[index || 0],
      );
    });
  });
});

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

describe('getPreviousTracks', () => {
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
        expect(getPreviousTracks(queue, currentIndex, repeat)).toEqual(
          expected,
        );
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

describe('pruneOriginalQueue', () => {
  describe.each([
    [
      tracks,
      [tracks[1], tracks[2], { id: 'extra-id' }],
      [tracks[1], tracks[2]],
    ],
    [[tracks[1], tracks[2]], [tracks[3], tracks[4]], []],
    [[], [tracks[0]], []],
    [[tracks[0]], [], []],
    [[], [], []],
    [tracks, tracks, tracks],
  ])(
    'when shuffledQueue is %j and originalQueue is %j',
    (shuffledQueue, originalQueue, expected) => {
      it('returns filtered items from b whose ids exist in a', () => {
        expect(
          pruneOriginalQueue(
            shuffledQueue as PlayableTrack[],
            originalQueue as PlayableTrack[],
          ),
        ).toEqual(expected);
      });
    },
  );
});
