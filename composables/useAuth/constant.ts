export const COOKIE_NAMES = {
  auth: 'subsonic_auth_params',
} as const;

export const DAYS_COOKIE_EXPIRES = 60;

export const STATES_TO_CLEAR = [
  STATE_NAMES.currentUser,
  STATE_NAMES.favouriteIds,
  STATE_NAMES.favourites,
  STATE_NAMES.genres,
  STATE_NAMES.playlist,
  STATE_NAMES.playlists,
  STATE_NAMES.radioStations,
  STATE_NAMES.userAuthenticated,
];
