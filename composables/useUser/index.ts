/* istanbul ignore next -- @preserve */
export function useUser() {
  return useState<null | User>('user', () => null);
}
