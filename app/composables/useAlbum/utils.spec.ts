import { getSortType } from './utils';

describe('getSortType', () => {
  describe.each([
    [ROUTE_ALBUMS_SORT_BY_PARAMS.Random, 'random'],
    [ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z'], 'alphabeticalByName'],
    [ROUTE_ALBUMS_SORT_BY_PARAMS['By artist'], 'alphabeticalByArtist'],
    [ROUTE_ALBUMS_SORT_BY_PARAMS['Most played'], 'frequent'],
    [ROUTE_ALBUMS_SORT_BY_PARAMS['Recently added'], 'newest'],
    [ROUTE_ALBUMS_SORT_BY_PARAMS['Recently played'], 'recent'],
    ['Invalid', undefined],
    [null, undefined],
    [undefined, undefined],
    [123, undefined],
  ])('when sortBy is %s', (sortBy, output) => {
    it('return correct value', () => {
      expect(getSortType(sortBy as AlbumSortBy)).toBe(output);
    });
  });
});
