import { getIndex } from './utils';

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

describe('shuffleArray', () => {
  describe.each([[undefined], [1], [2]])('when index is %s', (index) => {
    it('sets the correct index as the first array item', () => {
      expect(shuffleArray([...arrayList], index)[0]).toEqual({
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
