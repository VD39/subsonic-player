import ReadMore from '@/components/Atoms/ReadMore.vue';
import AlbumInformation from '@/components/Molecules/AlbumInformation.vue';
import PodcastEpisodeInformation from '@/components/Molecules/PodcastEpisodeInformation.vue';
import PodcastInformation from '@/components/Molecules/PodcastInformation.vue';
import TrackDetails from '@/components/Molecules/TrackInformation.vue';
import AddPodcastForm from '@/components/Organisms/AddPodcastForm.vue';
import AddToPlaylistForm from '@/components/Organisms/AddToPlaylistForm.vue';
import AddUpdatePlaylistForm from '@/components/Organisms/AddUpdatePlaylistForm.vue';
import AddRadioStationForm from '@/components/Organisms/AddUpdateRadioStationForm.vue';
import { documentEventListenerMock } from '@/test/eventListenersMock';

import { useModal } from './index';

const {
  documentAddEventListenerSpy,
  documentEvents,
  documentRemoveEventListenerSpy,
} = documentEventListenerMock();

const { closeModal, modal, openModal } = useModal();

describe('useModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default modal value', () => {
    expect(modal.value).toEqual(DEFAULT_STATE);
  });

  describe('when openModal function is called', () => {
    describe.each([
      [
        MODAL_TYPE.addPlaylistModal,
        AddUpdatePlaylistForm,
        'Add playlist',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.updatePlaylistModal,
        AddUpdatePlaylistForm,
        'Update playlist',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.addPodcastModal,
        AddPodcastForm,
        'Add podcast',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.addRadioStationModal,
        AddRadioStationForm,
        'Add radio station',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.updateRadioStationModal,
        AddRadioStationForm,
        'Update radio station',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.albumDetailsModal,
        AlbumInformation,
        'Album Details',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.podcastEpisodeInformationModal,
        PodcastEpisodeInformation,
        'Podcast episode information',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.podcastInformationModal,
        PodcastInformation,
        'Podcast information',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.readMoreModal,
        ReadMore,
        'More',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.trackDetailsModal,
        TrackDetails,
        'Track Details',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.addToPlaylistModal,
        AddToPlaylistForm,
        'Add to playlist',
        {
          attrs: 'attrs',
        },
      ],
    ])('when modalType is %s', (modalType, component, title, attrs) => {
      beforeAll(() => {
        openModal(modalType);
      });

      it('adds the keydown event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'keydown',
          expect.any(Function),
        );
      });

      describe('when attrs are not set', () => {
        it('sets the correct modal value', () => {
          expect(modal.value).toEqual({
            attrs: {},
            component: markRaw(component),
            title,
          });
        });
      });

      describe('when attrs are set', () => {
        beforeAll(() => {
          openModal(modalType, attrs);
        });

        it('sets the correct modal value', () => {
          expect(modal.value).toEqual({
            attrs,
            component: markRaw(component),
            title,
          });
        });
      });

      describe('when a non esc key is pressed', () => {
        beforeAll(() => {
          documentEvents.keydown({ key: 'Shift' });
        });

        it('does not remove the keydown event listener function', () => {
          expect(documentRemoveEventListenerSpy).not.toHaveBeenCalled();
        });

        it('does not reset the modal value', () => {
          expect(modal.value).toEqual({
            attrs,
            component: markRaw(component),
            title,
          });
        });
      });

      describe('when esc key is pressed', () => {
        beforeAll(() => {
          documentEvents.keydown({ key: 'Escape' });
        });

        it('removes the keydown event listener function', () => {
          expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
            'keydown',
            expect.any(Function),
          );
        });

        it('resets modal value to default state', () => {
          expect(modal.value).toEqual(DEFAULT_STATE);
        });
      });
    });
  });

  describe('when openModal function is called with an model type undefined', () => {
    beforeEach(() => {
      openModal('unKnown' as ModalType);
    });

    it('does not set the modal value', () => {
      expect(modal.value).toEqual(DEFAULT_STATE);
    });
  });

  describe('when closeModal function is called', () => {
    beforeEach(() => {
      openModal(MODAL_TYPE.updatePlaylistModal);
      closeModal();
    });

    it('removes the keydown event listener function', () => {
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
    });

    it('resets modal value to default state', () => {
      expect(modal.value).toEqual(DEFAULT_STATE);
    });
  });
});
