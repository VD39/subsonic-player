// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToQueryString(params: Record<string, any>) {
  const list = Object.entries(params)
    .filter(([, value]) => value)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((value) => [
            encodeURIComponent(key),
            encodeURIComponent(value),
          ])
        : [[encodeURIComponent(key), encodeURIComponent(value)]],
    );

  return new URLSearchParams(list).toString();
}

export function isUrl(url: string) {
  return /^https?:\/\/[^ "]+$/.test(url);
}

/* istanbul ignore next -- @preserve */
export function parseQueryString(query = '') {
  return new URLSearchParams(decodeURIComponent(query));
}
