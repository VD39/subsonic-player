import type { MockInstance } from 'vitest';

import { artistDataMock, artistInfo2Mock, cookieMock } from '@/test/fixtures';

import artistApi from './artist';

const $fetchMock = vi.spyOn(globalThis, '$fetch') as MockInstance;

describe('artist-api', () => {
  afterEach(() => {
    vi.stubGlobal('getCookie', () => cookieMock);
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
            artistInfo2: artistInfo2Mock,
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            artist: artistDataMock,
            status: 'ok',
          },
        })
        .mockResolvedValueOnce({
          'subsonic-response': {
            status: 'ok',
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
        data: expect.objectContaining({
          id: 'id',
          name: 'name',
        }),
      });
    });
  });
});
