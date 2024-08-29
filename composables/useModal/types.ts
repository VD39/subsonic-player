import type { Raw } from 'vue';

export interface ModalProps {
  component: null | Raw<unknown>;
  title?: string | null;
  attrs?: Record<string, unknown>;
}

export type ModalType =
  | 'addPlaylistModal'
  | 'addPodcastModal'
  | 'addUpdateRadioStationModal'
  | 'podcastDescriptionModal'
  | 'podcastEpisodeDescriptionModal'
  | 'trackDetailsModal'
  | 'artistBiographyModal';
