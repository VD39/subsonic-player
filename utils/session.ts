import { getLocalStorage, setLocalStorage } from './storage';

export function loadSession() {
  return {
    hash: getLocalStorage('hash'),
    salt: getLocalStorage('salt'),
    server: getLocalStorage('server'),
    username: getLocalStorage('username'),
  };
}

export function saveSession(authData: Record<string, unknown> = {}) {
  Object.entries(authData).forEach(([key, value]) => {
    setLocalStorage(key, value);
  });
}
