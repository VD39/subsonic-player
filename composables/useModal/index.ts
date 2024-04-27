import type { ModalProps } from './types';
import PlaylistForm from '@/components/Forms/PlaylistForm.vue';

export function useModal() {
  const modal = useState<ModalProps>('modal-state', () => DEFAULT_STATE);

  function keydownHandler(event: KeyboardEvent) {
    if (modal.value.component && event.key === 'Escape') {
      close();
    }
  }

  function addEventListener() {
    document.addEventListener('keydown', keydownHandler);
  }

  function openAddPlaylistModal(attrs = {}) {
    modal.value = {
      component: markRaw(PlaylistForm),
      title: 'Add playlist',
      attrs,
    };

    addEventListener();
  }

  function close() {
    modal.value = DEFAULT_STATE;
    document.removeEventListener('keydown', keydownHandler);
  }

  return {
    close,
    modal,
    openAddPlaylistModal,
  };
}
