export function deleteLocalStorage(key?: string) {
  if (import.meta.client) {
    if (key) {
      globalThis.localStorage.removeItem(key);
      return;
    }

    globalThis.localStorage.clear();
  }
}

export function getLocalStorage<T>(key: string, fallback: T): T {
  if (import.meta.client) {
    const value = globalThis.localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return safeJsonParse(value, fallback);
  }

  return fallback;
}

export function setLocalStorage(key: string, value: unknown) {
  if (import.meta.client) {
    const json = safeJsonStringify(value);

    if (json) {
      globalThis.localStorage.setItem(key, json);
    }
  }
}
