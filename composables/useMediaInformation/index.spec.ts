import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import {
  getFormattedAlbumsMock,
  getFormattedPodcastEpisodesMock,
  getFormattedPodcastsMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import { useMediaInformation } from './index';

const track = getFormattedTracksMock()[0];
const album = getFormattedAlbumsMock()[0];
const podcast = getFormattedPodcastsMock()[0];
const podcastEpisode = getFormattedPodcastEpisodesMock()[0];

const openModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useModal', (original) => () => ({
  ...original(),
  openModal: openModalMock,
}));

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

const handleErrorMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useErrorHandler', (original) => () => ({
  ...original(),
  handleError: handleErrorMock,
}));

describe('useMediaInformation', () => {
  let composable: ReturnType<typeof useMediaInformation>;

  beforeAll(() => {
    composable = useMediaInformation();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the openAlbumDetailsModal function is called', () => {
    describe('when getAlbum returns an album', () => {
      beforeEach(async () => {
        getAlbumMock.mockResolvedValue(album);
        await composable.openAlbumDetailsModal(album);
      });

      it('does not call the handleError function', () => {
        expect(handleErrorMock).not.toHaveBeenCalled();
      });

      it('calls the getAlbum function with the correct id', () => {
        expect(getAlbumMock).toHaveBeenCalledWith(album.id);
      });

      it('calls the openModal function with the correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(
          MODAL_TYPE.albumDetailsModal,
          {
            album,
          },
        );
      });
    });

    describe('when getAlbum returns null', () => {
      beforeEach(async () => {
        getAlbumMock.mockResolvedValue(null);
        await composable.openAlbumDetailsModal(album);
      });

      it('calls the handleError function with the correct message', () => {
        expect(handleErrorMock).toHaveBeenCalledWith(
          'Unable to fetch album information. Please try again later.',
        );
      });

      it('does not call the openModal function', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the openPodcastDetailsModal function is called', () => {
    describe('when getPodcast returns a podcast', () => {
      beforeEach(async () => {
        getPodcastMock.mockResolvedValue(podcast);
        await composable.openPodcastDetailsModal(podcast);
      });

      it('does not call the handleError function', () => {
        expect(handleErrorMock).not.toHaveBeenCalled();
      });

      it('calls the getPodcast function with the correct id', () => {
        expect(getPodcastMock).toHaveBeenCalledWith(podcast.id);
      });

      it('calls the openModal function with the correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(
          MODAL_TYPE.podcastInformationModal,
          {
            podcast,
          },
        );
      });
    });

    describe('when getPodcast returns null', () => {
      beforeEach(async () => {
        getPodcastMock.mockResolvedValue(null);
        await composable.openPodcastDetailsModal(podcast);
      });

      it('calls the handleError function with the correct message', () => {
        expect(handleErrorMock).toHaveBeenCalledWith(
          'Unable to fetch podcast information. Please try again later.',
        );
      });

      it('does not call the openModal function', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the openTrackDetailsModal function is called', () => {
    describe.each([
      [
        podcastEpisode,
        MODAL_TYPE.podcastEpisodeInformationModal,
        {
          podcastEpisode,
        },
      ],
      [
        track,
        MODAL_TYPE.trackDetailsModal,
        {
          track,
        },
      ],
    ])('when track type is %s', (track, modalType, attrs) => {
      beforeEach(() => {
        composable.openTrackDetailsModal(track);
      });

      it('calls the openModal function with the correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(modalType, attrs);
      });
    });

    describe('when track type is not defined', () => {
      beforeEach(() => {
        delete (track as Partial<Track>).type;

        composable.openTrackDetailsModal(track);
      });

      it('does not call the openModal function', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });
});
