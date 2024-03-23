export function getLocalStorage(key: string) {
  if (import.meta.client) {
    const value = window.localStorage.getItem(key);

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
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Error setting local storage data for key "${key}":`,
        error,
      );
    }
  }
}

export function deleteLocalStorage() {
  if (import.meta.client) {
    window.localStorage.clear();
  }
}
