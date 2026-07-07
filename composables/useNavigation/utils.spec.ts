import { getRouteName } from './utils';

describe('getRouteName', () => {
  describe.each([
    [undefined, undefined],
    [null, undefined],
    ['/path', undefined],
    [
      {
        path: '/path',
      },
      undefined,
    ],
    [
      {
        name: ROUTE_NAMES.index,
      },
      ROUTE_NAMES.index,
    ],
  ])('when to is %o', (to, expected) => {
    it('returns the correct response', () => {
      expect(getRouteName(to as ToProp)).toBe(expected);
    });
  });
});
