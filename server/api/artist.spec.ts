import type { MockInstance } from 'vitest';

import { COOKIE_MOCK } from '@/test/fixtures';

import artistApi from './artist';

const $fetchMock = vi.spyOn(global, '$fetch') as MockInstance;

describe('artist-api', () => {
  afterEach(() => {
    vi.stubGlobal('getCookie', () => COOKIE_MOCK);
  });

  describe('when getCookie returns undefined', () => {
    beforeEach(() => {
      vi.stubGlobal('getCookie', () => undefined);
    });

    it('returns the correct response', async () => {
      expect(await artistApi({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe('when $fetch response for getArtistInfo2 or getArtist return null', () => {
    beforeEach(() => {
      $fetchMock.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    });

    it('returns the correct response', async () => {
      expect(await artistApi({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe("when $fetch response for getArtistInfo2 or getArtist don't return a subsonic-response key", () => {
    beforeEach(() => {
      $fetchMock
        .mockResolvedValueOnce({
          'subsonic-response': {},
        })
        .mockResolvedValueOnce(null);
    });

    it('returns the correct response', async () => {
      expect(await artistApi({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe('when $fetch response for getArtistInfo2 or getArtist status is not ok', () => {
    beforeEach(() => {
      $fetchMock
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'failed',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'ok',
          },
        });
    });

    it('returns the correct response', async () => {
      expect(await artistApi({} as never)).toEqual({
        data: null,
      });
    });
  });

  describe('when $fetch response for getArtistInfo2 and getArtist returns a value', () => {
    beforeEach(() => {
      $fetchMock
        .mockResolvedValueOnce({
          'subsonic-response': {
            artistInfo2: {
              id: 'id',
              musicBrainzId: 'musicBrainzId',
            },
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            artist: {
              id: 'id',
              name: 'name',
            },
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          data: {
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          data: {
            status: 'ok',
          },
        });
    });

    it('returns the correct response', async () => {
      expect(await artistApi({} as never)).toEqual({
        data: expect.objectContaining({
          id: 'id',
          musicBrainzUrl: 'https://musicbrainz.org/artist/musicBrainzId',
          name: 'name',
        }),
      });
    });
  });
});
