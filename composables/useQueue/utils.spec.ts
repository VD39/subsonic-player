import { getFormattedQueueTracksMock } from '@/test/helpers';

import { pruneOriginalQueue, shuffleTrackInQueue } from './utils';

const tracks = getFormattedQueueTracksMock(5);

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

describe('shuffleTrackInQueue', () => {
  describe.each([[undefined], [1], [2]])('when index is %s', (index) => {
    it('sets the correct index as the first array item', () => {
      expect(shuffleTrackInQueue([...tracks], index)[0]).toEqual(
        tracks[index || 0],
      );
    });
  });
});
