import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import {
  getFormattedAlbumsMock,
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import { useSearch } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

const albums = getFormattedAlbumsMock();
const artists = getFormattedArtistsMock();
const tracks = getFormattedTracksMock();

describe('useSearch', () => {
  let composable: ReturnType<typeof useSearch>;

  beforeAll(() => {
    composable = useSearch();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the fetchSearchResult function is called', () => {
    describe('when offset is not set', () => {
      beforeEach(async () => {
        await composable.fetchSearchResult({
          mediaType: 'albums',
          query: 'query',
        } as SearchParams);
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
          query: {
            albumCount: '50',
            albumOffset: 0,
            artistCount: '50',
            artistOffset: 0,
            query: 'query',
            songCount: '50',
            songOffset: 0,
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when offset is set', () => {
      describe('when offset is 1', () => {
        beforeEach(async () => {
          await composable.fetchSearchResult({
            mediaType: 'albums',
            offset: 1,
            query: 'query',
          } as SearchParams);
        });

        it('calls the fetchData function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
            query: {
              albumCount: '50',
              albumOffset: 1,
              artistCount: '50',
              artistOffset: 1,
              query: 'query',
              songCount: '50',
              songOffset: 1,
            },
            transform: expect.any(Function),
          });
        });
      });
    });

    describe.each([
      [
        ROUTE_MEDIA_TYPE_PARAMS.Albums,
        {
          id: 'albums',
        },
      ],
      [
        ROUTE_MEDIA_TYPE_PARAMS.Artists,
        {
          id: 'artists',
        },
      ],
      [
        ROUTE_MEDIA_TYPE_PARAMS.Tracks,
        {
          id: 'tracks',
        },
      ],
    ])(`when route mediaType is %s`, (mediaType, outcome) => {
      describe('when fetchData response returns null', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: null,
          });
        });

        it('returns the correct response', async () => {
          expect(
            await composable.fetchSearchResult({
              mediaType,
              query: 'query',
            } as SearchParams),
          ).toEqual([]);
        });
      });

      describe('when fetchData response returns an array', () => {
        beforeEach(() => {
          fetchDataMock.mockResolvedValue({
            data: {
              albums: [
                {
                  id: 'albums',
                },
              ],
              artists: [
                {
                  id: 'artists',
                },
              ],
              tracks: [
                {
                  id: 'tracks',
                },
              ],
            },
          });
        });

        it('returns the correct response', async () => {
          expect(
            await composable.fetchSearchResult({
              mediaType,
              query: 'query',
            } as SearchParams),
          ).toEqual([outcome]);
        });
      });
    });

    describe('when mediaType is not defined', () => {
      it('returns the correct response', async () => {
        expect(
          await composable.fetchSearchResult({
            query: 'query',
          } as SearchParams),
        ).toEqual([]);
      });
    });
  });

  describe('when the fetchSearchSuggestions function is called', () => {
    describe('when offset is not set', () => {
      beforeEach(async () => {
        await composable.fetchSearchSuggestions('query');
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
          query: {
            albumCount: 5,
            albumOffset: 0,
            artistCount: 5,
            artistOffset: 0,
            query: 'query',
            songCount: 5,
            songOffset: 0,
          },
          transform: expect.any(Function),
        });
      });
    });

    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.fetchSearchSuggestions('query')).toEqual([]);
      });
    });

    describe('when fetchData response returns arrays without data', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            albums: [],
            artists: [],
            tracks: [],
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.fetchSearchSuggestions('query')).toEqual([]);
      });
    });

    describe('when fetchData response returns data with artists only', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            albums: [],
            artists,
            tracks: [],
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.fetchSearchSuggestions('query')).toEqual([
          {
            items: [
              {
                artists: [],
                icon: ICONS.artist,
                id: `artist-${artists[0].id}`,
                name: artists[0].name,
                route: {
                  name: ROUTE_NAMES.artist,
                  params: {
                    [ROUTE_PARAM_KEYS.artist.id]: artists[0].id,
                  },
                },
                type: MEDIA_TYPE.artist,
              },
            ],
            searchType: ROUTE_MEDIA_TYPE_PARAMS.Artists,
            title: 'Artists',
          },
        ]);
      });
    });

    describe('when fetchData response returns data with albums only', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            albums,
            artists: [],
            tracks: [],
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.fetchSearchSuggestions('query')).toEqual([
          {
            items: [
              {
                artists: albums[0].artists,
                icon: ICONS.album,
                id: `album-${albums[0].id}`,
                name: albums[0].name,
                route: {
                  name: ROUTE_NAMES.album,
                  params: {
                    [ROUTE_PARAM_KEYS.album.id]: albums[0].id,
                  },
                },
                type: MEDIA_TYPE.album,
              },
            ],
            searchType: ROUTE_MEDIA_TYPE_PARAMS.Albums,
            title: 'Albums',
          },
        ]);
      });
    });

    describe('when fetchData response returns data with tracks only', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            albums: [],
            artists: [],
            tracks,
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.fetchSearchSuggestions('query')).toEqual([
          {
            items: [
              {
                artists: tracks[0].artists,
                icon: ICONS.track,
                id: `track-${tracks[0].id}`,
                name: tracks[0].name,
                route: {
                  name: ROUTE_NAMES.search,
                  params: {
                    [ROUTE_PARAM_KEYS.search.mediaType]:
                      ROUTE_MEDIA_TYPE_PARAMS.Tracks,
                    [ROUTE_PARAM_KEYS.search.query]: 'query',
                  },
                },
                track: tracks[0],
                type: MEDIA_TYPE.track,
              },
            ],
            searchType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
            title: 'Tracks',
          },
        ]);
      });
    });

    describe('when fetchData response returns data for all media types', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            albums,
            artists,
            tracks,
          },
        });
      });

      it('returns the correct response', async () => {
        expect(await composable.fetchSearchSuggestions('query')).toEqual([
          {
            items: [
              {
                artists: [],
                icon: ICONS.artist,
                id: `artist-${artists[0].id}`,
                name: artists[0].name,
                route: {
                  name: ROUTE_NAMES.artist,
                  params: {
                    [ROUTE_PARAM_KEYS.artist.id]: artists[0].id,
                  },
                },
                type: MEDIA_TYPE.artist,
              },
            ],
            searchType: ROUTE_MEDIA_TYPE_PARAMS.Artists,
            title: 'Artists',
          },
          {
            items: [
              {
                artists: albums[0].artists,
                icon: ICONS.album,
                id: `album-${albums[0].id}`,
                name: albums[0].name,
                route: {
                  name: ROUTE_NAMES.album,
                  params: {
                    [ROUTE_PARAM_KEYS.album.id]: albums[0].id,
                  },
                },
                type: MEDIA_TYPE.album,
              },
            ],
            searchType: ROUTE_MEDIA_TYPE_PARAMS.Albums,
            title: 'Albums',
          },
          {
            items: [
              {
                artists: tracks[0].artists,
                icon: ICONS.track,
                id: `track-${tracks[0].id}`,
                name: tracks[0].name,
                route: {
                  name: ROUTE_NAMES.search,
                  params: {
                    [ROUTE_PARAM_KEYS.search.mediaType]:
                      ROUTE_MEDIA_TYPE_PARAMS.Tracks,
                    [ROUTE_PARAM_KEYS.search.query]: 'query',
                  },
                },
                track: tracks[0],
                type: MEDIA_TYPE.track,
              },
            ],
            searchType: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
            title: 'Tracks',
          },
        ]);
      });
    });
  });
});
