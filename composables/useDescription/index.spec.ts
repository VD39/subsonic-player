import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useDescription } from './index';

const trackMock = {
  biography: 'biography',
  description: 'description',
};

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const { openTrackInformationModal } = useDescription();

describe('useDescription', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when openTrackInformationModal is called', () => {
    describe.each([
      [
        {
          ...trackMock,
          type: MEDIA_TYPE.artist,
        },
        MODAL_TYPE.artistBiographyModal,
        {
          description: trackMock.biography,
        },
      ],
      [
        {
          ...trackMock,
          type: MEDIA_TYPE.podcast,
        },
        MODAL_TYPE.podcastDescriptionModal,
        {
          description: trackMock.description,
        },
      ],
      [
        {
          ...trackMock,
          type: MEDIA_TYPE.podcastEpisode,
        },
        MODAL_TYPE.podcastEpisodeDescriptionModal,
        {
          description: trackMock.description,
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
        openTrackInformationModal(track as unknown as QueueTrack);
      });

      it('calls the openModal with correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(modalType, attrs);
      });
    });

    describe('when track type is not defined', () => {
      beforeEach(() => {
        openTrackInformationModal(trackMock as unknown as QueueTrack);
      });

      it('does not call the openModal', () => {
        expect(openModalMock).not.toHaveBeenCalled();
      });
    });
  });
});
