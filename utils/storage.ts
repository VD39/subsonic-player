export function deleteLocalStorage(key?: string) {
  if (import.meta.client) {
    if (key) {
      globalThis.localStorage.removeItem(key);
      return;
    }

    globalThis.localStorage.clear();
  }
}

export function getLocalStorage(key: string) {
  if (import.meta.client) {
    const value = globalThis.localStorage.getItem(key);

    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(
          `Error parsing local storage data for key "${key}":`,
          error,
        );
      }
    }
  }

  return '';
}

export function setLocalStorage(key: string, value: unknown) {
  if (import.meta.client) {
    try {
      globalThis.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Error setting local storage data for key "${key}":`,
        error,
      );
    }
  }
}
