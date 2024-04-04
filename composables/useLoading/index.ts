/* istanbul ignore next -- @preserve */
export function useLoading() {
  return useState('loading', () => false);
}
