export function convertToQueryString(
  params: Record<string, string | string[]>,
) {
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

/* istanbul ignore next -- @preserve */
export function parseQueryString(query = '') {
  return new URLSearchParams(decodeURIComponent(query));
}
