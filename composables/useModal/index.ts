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

export function useModal() {
  const { lockScroll, unlockScroll } = useScrollLock('modal');

  const modal = useState<ModalProps>(STATE_KEYS.modal, () => DEFAULT_STATE);

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function addEscapeKeyListener() {
    document.addEventListener('keydown', onKeydown);
  }

  function openAddUpdatePlaylistModal(
    attrs: ModalProps['attrs'],
    update = false,
  ) {
    modal.value = {
      attrs,
      component: markRaw(PlaylistForm),
      title: `${update ? 'Update' : 'Add'} playlist`,
    };
  }

  function openAddPodcastModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(AddPodcastForm),
      title: 'Add podcast',
    };
  }

  function openAddRadioStationModal(
    attrs: ModalProps['attrs'],
    update = false,
  ) {
    modal.value = {
      attrs,
      component: markRaw(AddRadioStationForm),
      title: `${update ? 'Update' : 'Add'} radio station`,
    };
  }

  function openPodcastEpisodeDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(PodcastEpisodeDetails),
      title: 'Podcast episode information',
    };
  }

  function openPodcastDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(PodcastDetails),
      title: 'Podcast information',
    };
  }

  function openReadMoreModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(ReadMore),
      title: 'More',
    };
  }

  function openTrackDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(TrackDetails),
      title: 'Track Details',
    };
  }

  function openAlbumDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(AlbumDetails),
      title: 'Album Details',
    };
  }

  function openAppUpdateModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(AppUpdate),
      title: 'Update available',
    };
  }

  function openConfirmDialog(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(ConfirmDialog),
      title: 'Confirm',
    };
  }

  function openAddToPlaylistFormModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(AddToPlaylistForm),
      title: 'Add to playlist',
    };
  }

  function openModal(modalType: ModalType, attrs = {}) {
    switch (modalType) {
      case MODAL_TYPE.addPlaylistModal:
        openAddUpdatePlaylistModal(attrs);
        break;
      case MODAL_TYPE.addPodcastModal:
        openAddPodcastModal(attrs);
        break;
      case MODAL_TYPE.addRadioStationModal:
        openAddRadioStationModal(attrs);
        break;
      case MODAL_TYPE.addToPlaylistModal:
        openAddToPlaylistFormModal(attrs);
        break;
      case MODAL_TYPE.albumDetailsModal:
        openAlbumDetailsModal(attrs);
        break;
      case MODAL_TYPE.appUpdateModal:
        openAppUpdateModal(attrs);
        break;
      case MODAL_TYPE.confirmDialog:
        openConfirmDialog(attrs);
        break;
      case MODAL_TYPE.podcastEpisodeInformationModal:
        openPodcastEpisodeDetailsModal(attrs);
        break;
      case MODAL_TYPE.podcastInformationModal:
        openPodcastDetailsModal(attrs);
        break;
      case MODAL_TYPE.readMoreModal:
        openReadMoreModal(attrs);
        break;
      case MODAL_TYPE.trackDetailsModal:
        openTrackDetailsModal(attrs);
        break;
      case MODAL_TYPE.updatePlaylistModal:
        openAddUpdatePlaylistModal(attrs, true);
        break;
      case MODAL_TYPE.updateRadioStationModal:
        openAddRadioStationModal(attrs, true);
        break;
    }

    if (modal.value.component && import.meta.client) {
      addEscapeKeyListener();
    }

    lockScroll();
  }

  function closeModal() {
    modal.value.attrs?.onModalClose?.();
    modal.value = DEFAULT_STATE;

    if (import.meta.client) {
      document.removeEventListener('keydown', onKeydown);
    }

    unlockScroll();
  }

  return {
    closeModal,
    modal,
    openModal,
  };
}
