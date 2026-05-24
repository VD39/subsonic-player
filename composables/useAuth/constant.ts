export const COOKIE_NAMES = {
  auth: 'subsonic_auth_params',
} as const;

export const DAYS_COOKIE_EXPIRES = 60;

export const STATES_TO_CLEAR = [
  STATE_KEYS.currentUser,
  STATE_KEYS.favouriteIds,
  STATE_KEYS.favourites,
  STATE_KEYS.genres,
  STATE_KEYS.playlist,
  STATE_KEYS.playlists,
  STATE_KEYS.radioStations,
  STATE_KEYS.userAuthenticated,
];
