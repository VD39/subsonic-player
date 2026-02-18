import ReadMore from '@/components/Atoms/ReadMore.vue';
import AlbumInformation from '@/components/Molecules/AlbumInformation.vue';
import PodcastEpisodeInformation from '@/components/Molecules/PodcastEpisodeInformation.vue';
import PodcastInformation from '@/components/Molecules/PodcastInformation.vue';
import TrackInformation from '@/components/Molecules/TrackInformation.vue';
import AddPodcastForm from '@/components/Organisms/AddPodcastForm.vue';
import AddToPlaylistForm from '@/components/Organisms/AddToPlaylistForm.vue';
import AddUpdatePlaylistForm from '@/components/Organisms/AddUpdatePlaylistForm.vue';
import AddRadioStationForm from '@/components/Organisms/AddUpdateRadioStationForm.vue';

export function useModal() {
  const { lockScroll, unlockScroll } = useScrollLock('modal');

  const modal = useState<ModalProps>(STATE_NAMES.modal, () => DEFAULT_STATE);

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function addEventListener() {
    document.addEventListener('keydown', onKeydown);
  }

  function openAddUpdatePlaylistModal(
    attrs: ModalProps['attrs'],
    update = false,
  ) {
    modal.value = {
      attrs,
      component: markRaw(AddUpdatePlaylistForm),
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

  function openPodcastEpisodeInformationModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(PodcastEpisodeInformation),
      title: 'Podcast episode information',
    };
  }

  function openPodcastInformationModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(PodcastInformation),
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
      component: markRaw(TrackInformation),
      title: 'Track Details',
    };
  }

  function openAlbumDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(AlbumInformation),
      title: 'Album Details',
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
      case MODAL_TYPE.podcastEpisodeInformationModal:
        openPodcastEpisodeInformationModal(attrs);
        break;
      case MODAL_TYPE.podcastInformationModal:
        openPodcastInformationModal(attrs);
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
      addEventListener();
    }

    console.log(`lockScroll: `, lockScroll);
    lockScroll();
  }

  function closeModal() {
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
