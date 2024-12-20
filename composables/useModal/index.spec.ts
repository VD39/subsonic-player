import MediaDescription from '@/components/Atoms/MediaDescription.vue';
import TrackDetails from '@/components/Molecules/TrackInformation.vue';
import AddPodcastForm from '@/components/Organisms/AddPodcastForm.vue';
import AddToPlaylistForm from '@/components/Organisms/AddToPlaylistForm.vue';
import AddUpdatePlaylistForm from '@/components/Organisms/AddUpdatePlaylistForm.vue';
import AddRadioStationForm from '@/components/Organisms/AddUpdateRadioStationForm.vue';

import { useModal } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: any = {};

const documentAddEventListenerSpy = vi
  .spyOn(document, 'addEventListener')
  .mockImplementation((event, cb) => {
    events[event] = cb;
  });
const documentRemoveEventListenerSpy = vi.spyOn(
  document,
  'removeEventListener',
);

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
        MODAL_TYPE.podcastDescriptionModal,
        MediaDescription,
        'Podcast Description',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.podcastEpisodeDescriptionModal,
        MediaDescription,
        'Episode Description',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.artistBiographyModal,
        MediaDescription,
        'Artist Biography',
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
          events.keydown({ key: 'Shift' });
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
          events.keydown({ key: 'Escape' });
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
