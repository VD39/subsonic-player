import {
  getIndex,
  removeRemovedTracksFromOriginalQueue,
  shuffleTrackInQueue,
} from './utils';

const arrayList = [
  {
    id: 'id',
  },
  {
    id: 'id1',
  },
  {
    id: 'id2',
  },
] as unknown as MixedTrack[];

describe('shuffleTrackInQueue', () => {
  describe.each([[undefined], [1], [2]])('when index is %s', (index) => {
    it('sets the correct index as the first array item', () => {
      expect(shuffleTrackInQueue([...arrayList], index)[0]).toEqual({
        id: `id${index ?? ''}`,
      });
    });
  });
});

describe('getIndex', () => {
  describe.each([
    ['id', 0],
    ['id1', 1],
    ['id2', 2],
    ['unknown', -1],
  ])('when id is %s', (id, output) => {
    it('returns the correct value', () => {
      expect(getIndex(arrayList, id)).toEqual(output);
    });
  });
});

describe('removeRemovedTracksFromOriginalQueue', () => {
  describe.each([
    [
      arrayList,
      [
        {
          id: 'id1',
        },
        {
          id: 'id2',
        },
        {
          id: 'id3',
        },
      ],
      [
        {
          id: 'id1',
        },
        {
          id: 'id2',
        },
      ],
    ],
    [
      [
        {
          id: 'id1',
        },
        {
          id: 'id2',
        },
      ],
      [
        {
          id: 'id3',
        },
        {
          id: 'id4',
        },
      ],
      [],
    ],
    [
      [],
      [
        {
          id: 'id1',
        },
      ],
      [],
    ],
    [
      [
        {
          id: 'id1',
        },
      ],
      [],
      [],
    ],
    [[], [], []],
    [arrayList, arrayList, arrayList],
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
