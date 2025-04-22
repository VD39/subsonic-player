import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useMediaInformation } from './index';

const trackMock = {
  biography: 'biography',
  description: 'description',
};

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const { openTrackInformationModal } = useMediaInformation();

describe('useMediaInformation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when openTrackInformationModal is called', () => {
    describe.each([
      [
        {
          ...trackMock,
          type: MEDIA_TYPE.podcastEpisode,
        },
        MODAL_TYPE.podcastEpisodeInformationModal,
        {
          podcastEpisode: {
            ...trackMock,
            type: MEDIA_TYPE.podcastEpisode,
          },
        },
      ],
      [
        {
          ...trackMock,
          type: MEDIA_TYPE.track,
        },
        MODAL_TYPE.trackDetailsModal,
        {
          track: {
            ...trackMock,
            type: MEDIA_TYPE.track,
          },
        },
      ],
    ])('when track type is %s', (track, modalType, attrs) => {
      beforeEach(() => {
        openTrackInformationModal(track as unknown as MixedTrack);
      });

      it('calls the openModal with correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(modalType, attrs);
      });
    });

    describe('when track type is not defined', () => {
      beforeEach(() => {
        openTrackInformationModal(trackMock as unknown as MixedTrack);
      });

      it('does not call the openModal', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });
});
