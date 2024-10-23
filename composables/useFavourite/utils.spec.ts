import { getParams } from './utils';

describe('getParams', () => {
  describe.each([
    [
      {
        id: 'id',
        type: MEDIA_TYPE.track,
      } as FavouriteParams,
      {
        albumId: undefined,
        artistId: undefined,
        id: 'id',
      },
    ],
    [
      {
        id: 'id',
        type: MEDIA_TYPE.album,
      } as FavouriteParams,
      {
        albumId: 'id',
        artistId: undefined,
        id: undefined,
      },
    ],
    [
      {
        id: 'id',
        type: MEDIA_TYPE.artist,
      } as FavouriteParams,
      {
        albumId: undefined,
        artistId: 'id',
        id: undefined,
      },
    ],
    [
      {
        id: 'id',
        type: MEDIA_TYPE.podcast,
      } as FavouriteParams,
      {
        albumId: undefined,
        artistId: undefined,
        id: undefined,
      },
    ],
  ])('when params is %o', (params, output) => {
    it('returns the correct value', () => {
      expect(getParams(params)).toEqual(output);
    });
  });
});
