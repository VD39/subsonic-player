import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import AlbumDetails from '@/components/album/AlbumDetails.vue';
import ConfirmDialog from '@/components/notification/ConfirmDialog.vue';
import AddToPlaylistForm from '@/components/playlist/AddToPlaylistForm.vue';
import PlaylistForm from '@/components/playlist/PlaylistForm.vue';
import AddPodcastForm from '@/components/podcast/AddPodcastForm.vue';
import PodcastDetails from '@/components/podcast/PodcastDetails.vue';
import PodcastEpisodeDetails from '@/components/podcast/PodcastEpisodeDetails.vue';
import AddRadioStationForm from '@/components/radio/RadioStationForm.vue';
import AppUpdate from '@/components/settings/AppUpdate.vue';
import TrackDetails from '@/components/track-details/TrackDetails.vue';
import ReadMore from '@/components/ui/ReadMore.vue';
import { documentEventListenerMock } from '@/test/eventListenersMock';

import { useModal } from './index';

const { lockScrollMock, unlockScrollMock } = vi.hoisted(() => ({
  lockScrollMock: vi.fn(),
  unlockScrollMock: vi.fn(),
}));

mockNuxtImport('useScrollLock', (original) => () => ({
  ...original(),
  lockScroll: lockScrollMock,
  unlockScroll: unlockScrollMock,
}));

const onModalCloseMock = vi.fn();

const {
  documentAddEventListenerSpy,
  documentEvents,
  documentRemoveEventListenerSpy,
} = documentEventListenerMock();

describe('useModal', () => {
  let composable: ReturnType<typeof useModal>;

  beforeAll(() => {
    composable = useModal();
  });

  it('sets the default modal value', () => {
    expect(composable.modal.value).toEqual(DEFAULT_STATE);
  });

  describe('when the openModal function is called', () => {
    describe.each([
      [
        MODAL_TYPE.addPlaylistModal,
        PlaylistForm,
        'Add playlist',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.updatePlaylistModal,
        PlaylistForm,
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
        AlbumDetails,
        'Album Details',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.appUpdateModal,
        AppUpdate,
        'Update available',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.podcastEpisodeInformationModal,
        PodcastEpisodeDetails,
        'Podcast episode information',
        {
          attrs: 'attrs',
        },
      ],
      [
        MODAL_TYPE.podcastInformationModal,
        PodcastDetails,
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
        MODAL_TYPE.confirmDialog,
        ConfirmDialog,
        'Confirm',
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
    ])('when the modalType is %s', (modalType, component, title, attrs) => {
      beforeAll(() => {
        vi.clearAllMocks();
        composable.openModal(modalType);
      });

      it('adds the keydown event listener function', () => {
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'keydown',
          expect.any(Function),
        );
      });

      it('calls the lockScroll function', () => {
        expect(lockScrollMock).toHaveBeenCalled();
      });

      describe('when the attrs are not set', () => {
        it('sets the correct modal value', () => {
          expect(composable.modal.value).toEqual({
            attrs: {},
            component: markRaw(component),
            title,
          });
        });
      });

      describe('when the attrs are set', () => {
        beforeAll(() => {
          composable.openModal(modalType, attrs);
        });

        it('sets the correct modal value', () => {
          expect(composable.modal.value).toEqual({
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
          expect(composable.modal.value).toEqual({
            attrs,
            component: markRaw(component),
            title,
          });
        });

        it('does not call the unlockScroll function', () => {
          expect(unlockScrollMock).not.toHaveBeenCalled();
        });
      });

      describe('when the esc key is pressed', () => {
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
          expect(composable.modal.value).toEqual(DEFAULT_STATE);
        });

        it('calls the unlockScroll function', () => {
          expect(unlockScrollMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the openModal function is called with an model type undefined', () => {
    beforeEach(() => {
      composable.openModal('unKnown' as ModalType);
    });

    it('does not set the modal value', () => {
      expect(composable.modal.value).toEqual(DEFAULT_STATE);
    });
  });

  describe('when the closeModal function is called', () => {
    beforeEach(() => {
      composable.openModal(MODAL_TYPE.updatePlaylistModal);
      composable.closeModal();
    });

    it('removes the keydown event listener function', () => {
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
    });

    it('resets modal value to default state', () => {
      expect(composable.modal.value).toEqual(DEFAULT_STATE);
    });

    it('calls the unlockScroll function', () => {
      expect(unlockScrollMock).toHaveBeenCalled();
    });

    describe('when the onModalClose attr is set', () => {
      beforeEach(() => {
        composable.openModal(MODAL_TYPE.updatePlaylistModal, {
          onModalClose: onModalCloseMock,
        });

        composable.closeModal();
      });

      it('calls the onModalClose function', () => {
        expect(onModalCloseMock).toHaveBeenCalled();
      });
    });
  });
});
