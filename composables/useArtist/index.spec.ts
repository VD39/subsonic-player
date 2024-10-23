import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useArtist } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const { artist, artists, getArtist, getArtists } = useArtist();

describe('useArtist', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default artist value', () => {
    expect(artist.value).toEqual(null);
  });

  it('sets the default artists value', () => {
    expect(artists.value).toEqual([]);
  });

  describe('when the getArtists function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getArtists();
      });

      it('does not add to the artists value', () => {
        expect(artists.value).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name',
            },
          ],
        });

        getArtists();
      });

      it('adds to the artists value', () => {
        expect(artists.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the getArtist function is called', () => {
    describe('when fetchData responses returns null', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: null,
          });

        getArtist('id');
      });

      it('does not add to the artists value', () => {
        expect(artist.value).toBe(null);
      });
    });

    describe('when only one fetchData responses returns a value', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: {
              artist: {
                id: 'id',
                name: 'name',
              },
            },
          });

        getArtist('id');
      });

      it('adds to the artist value', () => {
        expect(artist.value).toEqual(
          expect.objectContaining({
            id: 'id',
            musicBrainzUrl: undefined,
            name: 'name',
          }),
        );
      });
    });

    describe('when both fetchData responses return a value', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: {
              artistInfo2: {
                id: 'id',
                musicBrainzId: 'musicBrainzId',
              },
            },
          })
          .mockResolvedValueOnce({
            data: {
              artist: {
                id: 'id',
                name: 'name',
              },
            },
          });

        getArtist('id');
      });

      it('adds to the artist value', () => {
        expect(artist.value).toEqual(
          expect.objectContaining({
            id: 'id',
            musicBrainzUrl: 'https://musicbrainz.org/artist/musicBrainzId',
            name: 'name',
          }),
        );
      });
    });
  });
});
