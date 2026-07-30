export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export function safeJsonParse<R = null>(
  json: string,
  fallback: R = null as unknown as R,
): R {
  try {
    return JSON.parse(json) as R;
  } catch {
    return fallback;
  }
}

export function safeJsonStringify<T extends null | string = null>(
  obj: unknown,
  fallback: T = null as unknown as T,
): string | T {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
}
