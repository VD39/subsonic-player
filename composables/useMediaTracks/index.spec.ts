import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import {
  getFormattedAlbumsMock,
  getFormattedPlaylistsMock,
  getFormattedPodcastEpisodesMock,
  getFormattedPodcastsMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import { useMediaTracks } from './index';

const getAlbumMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAlbum', (original) => () => ({
  ...original(),
  getAlbum: getAlbumMock,
}));

const getPodcastMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePodcast', (original) => () => ({
  ...original(),
  getPodcast: getPodcastMock,
}));

const album = getFormattedAlbumsMock()[0];
const albumWithoutTracks = getFormattedAlbumsMock(1, {
  tracks: [],
})[0];
const playlist = getFormattedPlaylistsMock()[0];
const podcast = getFormattedPodcastsMock()[0];
const podcastEpisode = getFormattedPodcastEpisodesMock()[0];
const track = getFormattedTracksMock()[0];

describe('useMediaTracks', () => {
  let composable: ReturnType<typeof useMediaTracks>;

  beforeAll(() => {
    composable = useMediaTracks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getMediaTracks function is called', () => {
    let result: Awaited<ReturnType<typeof composable.getMediaTracks>>;

    describe(`when media type is ${MEDIA_TYPE.album}`, () => {
      describe('when album has tracks', () => {
        beforeEach(async () => {
          result = await composable.getMediaTracks(album);
        });

        it('does not call the getAlbum function', () => {
          expect(getAlbumMock).not.toHaveBeenCalled();
        });

        it('returns the correct response', () => {
          expect(result).toEqual(album.tracks);
        });
      });

      describe('when album does not have tracks', () => {
        beforeEach(async () => {
          getAlbumMock.mockResolvedValue(album);
          result = await composable.getMediaTracks(albumWithoutTracks);
        });

        it('calls the getAlbum function with the correct id', () => {
          expect(getAlbumMock).toHaveBeenCalledWith(album.id);
        });

        describe('when getAlbum returns an album', () => {
          it('returns the correct response', () => {
            expect(result).toEqual(album.tracks);
          });
        });

        describe('when getAlbum returns null', () => {
          beforeEach(async () => {
            getAlbumMock.mockResolvedValue(null);
            result = await composable.getMediaTracks(albumWithoutTracks);
          });

          it('returns the correct response', () => {
            expect(result).toBeNull();
          });
        });
      });
    });

    describe(`when media type is ${MEDIA_TYPE.playlist}`, () => {
      it('returns the correct response', async () => {
        expect(await composable.getMediaTracks(playlist)).toEqual(
          playlist.tracks,
        );
      });
    });

    describe(`when media type is ${MEDIA_TYPE.podcast}`, () => {
      beforeEach(async () => {
        getPodcastMock.mockResolvedValue(podcast);
        result = await composable.getMediaTracks(podcast);
      });

      it('calls the getPodcast function with the correct id', () => {
        expect(getPodcastMock).toHaveBeenCalledWith(podcast.id);
      });

      describe('when getPodcast returns a podcast', () => {
        it('returns the correct response', () => {
          expect(result).toEqual(podcast.episodes.downloaded);
        });
      });

      describe('when getPodcast returns null', () => {
        beforeEach(async () => {
          getPodcastMock.mockResolvedValue(null);
          result = await composable.getMediaTracks(podcast);
        });

        it('returns the correct response', () => {
          expect(result).toBeNull();
        });
      });
    });

    describe(`when media type is ${MEDIA_TYPE.podcastEpisode}`, () => {
      it('returns the correct response', async () => {
        expect(await composable.getMediaTracks(podcastEpisode)).toEqual([
          podcastEpisode,
        ]);
      });
    });

    describe(`when media type is ${MEDIA_TYPE.track}`, () => {
      it('returns the correct response', async () => {
        expect(await composable.getMediaTracks(track)).toEqual([track]);
      });
    });

    describe('when media type is unknown', () => {
      it('returns the correct response', async () => {
        expect(await composable.getMediaTracks({} as never)).toBeNull();
      });
    });
  });
});
