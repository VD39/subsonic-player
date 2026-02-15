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

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const getAlbumMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  getAlbum: getAlbumMock,
}));

const getPodcastMock = vi.fn();

mockNuxtImport('usePodcast', () => () => ({
  getPodcast: getPodcastMock,
}));

const addErrorSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addErrorSnack: addErrorSnackMock,
}));

const {
  openAlbumInformationModal,
  openPodcastInformationModal,
  openTrackInformationModal,
} = useMediaInformation();

describe('useMediaInformation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the openAlbumInformationModal function is called', () => {
    describe('when getAlbum returns an album', () => {
      beforeEach(async () => {
        getAlbumMock.mockResolvedValue(album);
        await openAlbumInformationModal(album);
      });

      it('does not call the addErrorSnack function', () => {
        expect(addErrorSnackMock).not.toHaveBeenCalled();
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
        await openAlbumInformationModal(album);
      });

      it('calls the addErrorSnack function with the correct message', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith(
          'Unable to fetch album information. Please try again later.',
        );
      });

      it('does not call the openModal function', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the openPodcastInformationModal function is called', () => {
    describe('when getPodcast returns a podcast', () => {
      beforeEach(async () => {
        getPodcastMock.mockResolvedValue(podcast);
        await openPodcastInformationModal(podcast);
      });

      it('does not call the addErrorSnack function', () => {
        expect(addErrorSnackMock).not.toHaveBeenCalled();
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
        await openPodcastInformationModal(podcast);
      });

      it('calls the addErrorSnack function with the correct message', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith(
          'Unable to fetch podcast information. Please try again later.',
        );
      });

      it('does not call the openModal function', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the openTrackInformationModal function is called', () => {
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
        openTrackInformationModal(track);
      });

      it('calls the openModal function with correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(modalType, attrs);
      });
    });

    describe('when track type is not defined', () => {
      beforeEach(() => {
        delete (track as Partial<Track>).type;

        openTrackInformationModal(track);
      });

      it('does not call the openModal function', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });
});
