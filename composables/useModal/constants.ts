export const DEFAULT_STATE = {
  attrs: {},
  component: null,
  title: null,
};

export const MODAL_TYPE = {
  addPlaylistModal: 'addPlaylistModal',
  addPodcastModal: 'addPodcastModal',
  addRadioStationModal: 'addRadioStationModal',
  addToPlaylistModal: 'addToPlaylistModal',
  albumDetailsModal: 'albumDetailsModal',
  podcastEpisodeInformationModal: 'podcastEpisodeInformationModal',
  podcastInformationModal: 'podcastInformationModal',
  readMoreModal: 'readMoreModal',
  trackDetailsModal: 'trackDetailsModal',
  updatePlaylistModal: 'updatePlaylistModal',
  updateRadioStationModal: 'updateRadioStationModal',
} as const;
