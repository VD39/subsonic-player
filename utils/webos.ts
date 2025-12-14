/**
 * webOS platform detection and authentication storage utilities
 *
 * On webOS TV, the app runs with file:// protocol which doesn't support cookies.
 * These utilities provide localStorage-based authentication for webOS compatibility.
 */

// Storage key for auth params
const AUTH_STORAGE_KEY = 'subsonic_auth_params';

/**
 * Get auth token from localStorage (for webOS)
 */
export function getAuthFromLocalStorage(): null | string {
  if (!import.meta.client) return null;
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('[webOS] Error reading from localStorage:', e);
    return null;
  }
}

/**
 * Check if we're running on webOS (file:// protocol)
 */
export function isWebOS(): boolean {
  if (!import.meta.client) return false;
  try {
    return window.location.protocol === 'file:';
  } catch {
    return false;
  }
}

/**
 * Set auth token in localStorage (for webOS)
 */
export function setAuthInLocalStorage(value: null | string): void {
  if (!import.meta.client) return;
  try {
    if (value) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('[webOS] Error writing to localStorage:', e);
  }
}
