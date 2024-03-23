export function toQueryString(params: Record<string, string | string[]>) {
  const list = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map((value) => [
            encodeURIComponent(key),
            encodeURIComponent(value),
          ])
        : [[encodeURIComponent(key), encodeURIComponent(value)]],
    )
    .flat();

  return new URLSearchParams(list).toString();
}
