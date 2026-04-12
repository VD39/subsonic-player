import { getFormattedQueueTracksMock } from '@/test/helpers';

import {
  getIndex,
  getPreviousTrack,
  getTracksToPreload,
  getUpcomingTracks,
  removeRemovedTracksFromOriginalQueue,
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
        tracks[index ?? 0],
      );
    });
  });
});

describe('getIndex', () => {
  describe.each([
    [tracks[0].id, 0],
    [tracks[1].id, 1],
    [tracks[2].id, 2],
    ['unknown', -1],
  ])('when id is %s', (id, output) => {
    it('returns the correct response', () => {
      expect(getIndex(tracks, id)).toEqual(output);
    });
  });
});

describe('getUpcomingTracks', () => {
  describe.each([
    [tracks, 0, -1, [tracks[1], tracks[2], tracks[3]]],
    [tracks, 3, -1, [tracks[4]]],
    [tracks, 4, -1, []],
    [tracks, 3, Number.POSITIVE_INFINITY, [tracks[4], tracks[0], tracks[1]]],
    [[], 0, -1, []],
    [radioTracks, 0, -1, []],
    [noStreamUrlTracks, 0, -1, [noStreamUrlTracks[2]]],
    [shortTracks, 0, -1, [shortTracks[1]]],
    [
      shortTracks,
      0,
      Number.POSITIVE_INFINITY,
      [shortTracks[1], shortTracks[0]],
    ],
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
    [tracks, 1, -1, [tracks[0]]],
    [tracks, 0, -1, []],
    [tracks, 0, Number.POSITIVE_INFINITY, [tracks[4]]],
    [[], 0, -1, []],
    [radioTracks, 1, -1, []],
    [noStreamUrlTracks, 2, -1, []],
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
    [tracks, 1, -1, [tracks[2], tracks[3], tracks[4], tracks[0]]],
    [tracks, 0, -1, [tracks[1], tracks[2], tracks[3]]],
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

describe('removeRemovedTracksFromOriginalQueue', () => {
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
          removeRemovedTracksFromOriginalQueue(
            shuffledQueue as MixedTrack[],
            originalQueue as MixedTrack[],
          ),
        ).toEqual(expected);
      });
    },
  );
});
