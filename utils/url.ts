// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToQueryString(params: Record<string, any>) {
  const list = Object.entries(params)
    .filter(([, value]) => value)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((value) => [key, String(value)])
        : [[key, String(value)]],
    );

  return new URLSearchParams(list).toString();
}

export function isUrl(url: string) {
  return /^https?:\/\/[^ "]+$/.test(url.toLowerCase());
}

/* istanbul ignore next -- @preserve */
export function parseQueryString(query = '') {
  return new URLSearchParams(query);
}
