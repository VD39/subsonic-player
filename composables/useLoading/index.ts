/* istanbul ignore next -- @preserve */
export function useLoading() {
  return useState(STATE_NAMES.globalLoading, () => false);
}
