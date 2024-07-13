import AddPlaylistForm from '@/components/Forms/AddPlaylistForm.vue';
import AddRadioStationForm from '@/components/Forms/AddRadioStationForm.vue';
import AddPodcastForm from '@/components/Forms/AddPodcastForm.vue';
import PodcastDescription from '@/components/TrackDetails/PodcastDescription.vue';
import TrackDetails from '~/components/TrackDetails/TrackInformation.vue';

export function useModal() {
  const modal = useState<ModalProps>('modal-state', () => DEFAULT_STATE);

  function keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function addEventListener() {
    document.addEventListener('keydown', keydownHandler);
  }

  function openAddPlaylistModal(attrs: ModalProps['attrs']) {
    modal.value = {
      component: markRaw(AddPlaylistForm),
      title: 'Add playlist',
      attrs,
    };
  }

  function openAddPodcastModal(attrs: ModalProps['attrs']) {
    modal.value = {
      component: markRaw(AddPodcastForm),
      title: 'Add podcast',
      attrs,
    };
  }

  function openAddRadioStationModal(attrs: ModalProps['attrs']) {
    modal.value = {
      component: markRaw(AddRadioStationForm),
      title: 'Add radio station',
      attrs,
    };
  }

  function openPodcastDescriptionModal(attrs: ModalProps['attrs']) {
    modal.value = {
      component: markRaw(PodcastDescription),
      title: 'Episode Description',
      attrs,
    };
  }

  function openTrackDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      component: markRaw(TrackDetails),
      title: 'Track Details',
      attrs,
    };
  }

  function openModal(modalType: ModalType, attrs = {}) {
    switch (modalType) {
      case 'addPlaylistModal':
        openAddPlaylistModal(attrs);
        break;
      case 'addPodcastModal':
        openAddPodcastModal(attrs);
        break;
      case 'addRadioStationModal':
        openAddRadioStationModal(attrs);
        break;
      case 'podcastDescriptionModal':
        openPodcastDescriptionModal(attrs);
        break;
      case 'trackDetailsModal':
        openTrackDetailsModal(attrs);
        break;
    }

    if (modal.value.component) {
      addEventListener();
    }
  }

  function closeModal() {
    modal.value = DEFAULT_STATE;
    document.removeEventListener('keydown', keydownHandler);
  }

  return {
    closeModal,
    modal,
    openModal,
  };
}
