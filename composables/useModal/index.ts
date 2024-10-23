import MediaDescription from '@/components/Atoms/MediaDescription.vue';
import TrackDetails from '@/components/Molecules/TrackInformation.vue';
import AddPodcastForm from '@/components/Organisms/AddPodcastForm.vue';
import AddUpdatePlaylistForm from '@/components/Organisms/AddUpdatePlaylistForm.vue';
import AddRadioStationForm from '@/components/Organisms/AddUpdateRadioStationForm.vue';

export function useModal() {
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

  function openPodcastDescriptionModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(MediaDescription),
      title: 'Podcast Description',
    };
  }

  function openPodcastEpisodeDescriptionModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(MediaDescription),
      title: 'Episode Description',
    };
  }

  function openArtistBiographyModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(MediaDescription),
      title: 'Artist Biography',
    };
  }

  function openTrackDetailsModal(attrs: ModalProps['attrs']) {
    modal.value = {
      attrs,
      component: markRaw(TrackDetails),
      title: 'Track Details',
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
      case MODAL_TYPE.artistBiographyModal:
        openArtistBiographyModal(attrs);
        break;
      case MODAL_TYPE.podcastDescriptionModal:
        openPodcastDescriptionModal(attrs);
        break;
      case MODAL_TYPE.podcastEpisodeDescriptionModal:
        openPodcastEpisodeDescriptionModal(attrs);
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

    if (modal.value.component) {
      addEventListener();
    }
  }

  function closeModal() {
    modal.value = DEFAULT_STATE;
    document.removeEventListener('keydown', onKeydown);
  }

  return {
    closeModal,
    modal,
    openModal,
  };
}
