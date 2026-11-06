import { shuffleArray } from './shuffle';

describe('shuffleArray', () => {
  describe('when the array is empty', () => {
    it('returns the correct response', () => {
      expect(shuffleArray([])).toEqual([]);
    });
  });

  describe('when the array is not empty', () => {
    it('mutates and returns the same array reference', () => {
      const input = [1, 2, 3];
      const result = shuffleArray(input);

      // Check that the input array is mutated.
      expect(result).toBe(input);
      expect(result).not.toEqual([1, 2, 3]);
    });

    describe('when the array has a single element', () => {
      it('returns the correct response', () => {
        expect(shuffleArray([1])).toEqual([1]);
      });
    });

    describe('when the array has 2 elements', () => {
      it('returns the correct response', () => {
        expect(shuffleArray([1, 2])).toEqual([2, 1]);
      });
    });

    describe('when the array has 3 or more elements', () => {
      it('moves every element to a different position', () => {
        const original = [1, 2, 3, 4, 5];
        const result = shuffleArray([...original]);

        const allMoved = result.every(
          (item, index) => item !== original[index],
        );

        expect(allMoved).toBe(true);
      });

      it('contains the same elements as the input', () => {
        const input = [1, 2, 3, 4, 5];
        const original = [...input];
        shuffleArray(input);

        expect(input.toSorted((a, b) => a - b)).toEqual(
          original.toSorted((a, b) => a - b),
        );
      });
    });
  });
});
