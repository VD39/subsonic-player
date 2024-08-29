import { sliceArrayBySizeAndOffset } from './sliceArrayBySizeAndOffset';

const array = [1, 2, 3, 4, 5];

describe('sliceArrayBySizeAndOffset', () => {
  describe.each([
    [2, 1, [2, 3]],
    [0, 2, []],
    [3, 0, [1, 2, 3]],
    [2, 3, [4, 5]],
    [5, 1, [2, 3, 4, 5]],
    [2, 5, []],
    [2, -1, []],
    [-2, -3, []],
  ])('when size is %i and offset is %i', (size, offset, output) => {
    it('should return the expected result', () => {
      expect(sliceArrayBySizeAndOffset(array, size, offset)).toEqual(output);
    });
  });
});
