import AddPlaylistForm from '@/components/Forms/AddPlaylistForm.vue';
import AddRadioStationForm from '@/components/Forms/AddUpdateRadioStationForm.vue';
import AddPodcastForm from '@/components/Forms/AddPodcastForm.vue';
import MediaDescription from '@/components/TrackDetails/MediaDescription.vue';
import TrackDetails from '@/components/TrackDetails/TrackInformation.vue';
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

const { modal, closeModal, openModal } = useModal();

describe('useModal', () => {
  it('sets the default modal value', () => {
    expect(modal.value).toEqual(DEFAULT_STATE);
  });

  describe.each([
    [
      'addPlaylistModal',
      AddPlaylistForm,
      'Add playlist',
      {
        attrs: 'attrs',
      },
    ],
    [
      'addPodcastModal',
      AddPodcastForm,
      'Add podcast',
      {
        attrs: 'attrs',
      },
    ],
    [
      'addUpdateRadioStationModal',
      AddRadioStationForm,
      'Add radio station',
      {
        attrs: 'attrs',
      },
    ],
    [
      'podcastDescriptionModal',
      MediaDescription,
      'Podcast Description',
      {
        attrs: 'attrs',
      },
    ],
    [
      'podcastEpisodeDescriptionModal',
      MediaDescription,
      'Episode Description',
      {
        attrs: 'attrs',
      },
    ],
    [
      'artistBiographyModal',
      MediaDescription,
      'Artist Biography',
      {
        attrs: 'attrs',
      },
    ],
    [
      'trackDetailsModal',
      TrackDetails,
      'Track Details',
      {
        attrs: 'attrs',
      },
    ],
  ])(
    'when openModal function is called with %s',
    (modalType, component, title, attrs) => {
      beforeAll(() => {
        openModal(modalType as ModalType);
      });

      describe('when attrs are not set', () => {
        it('sets the correct modal value', () => {
          expect(modal.value).toEqual({
            component: markRaw(component),
            title,
            attrs: {},
          });
        });
      });

      describe('when attrs are set', () => {
        beforeAll(() => {
          vi.clearAllMocks();
          openModal(modalType as ModalType, attrs);
        });

        it('sets the correct modal value', () => {
          expect(modal.value).toEqual({
            component: markRaw(component),
            title,
            attrs,
          });
        });

        it('adds the keydown event listener function', () => {
          expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
            'keydown',
            expect.any(Function),
          );
        });
      });

      describe('when a non esc key is pressed', () => {
        beforeEach(() => {
          events.keydown({ key: 'Shift' });
        });

        it('does not remove the keydown event listener function', () => {
          expect(documentRemoveEventListenerSpy).not.toHaveBeenCalled();
        });

        it('does not reset the modal value', () => {
          expect(modal.value).toEqual({
            component: markRaw(component),
            title,
            attrs,
          });
        });
      });

      describe('when esc key is pressed', () => {
        beforeEach(() => {
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
    },
  );

  describe('when openModal function is called with an model type undefined', () => {
    beforeAll(() => {
      openModal('unKnown' as ModalType);
    });

    it('does not set the modal value', () => {
      expect(modal.value).toEqual(DEFAULT_STATE);
    });
  });

  describe('when closeModal function is called', () => {
    beforeEach(() => {
      openModal('addPlaylistModal');
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
