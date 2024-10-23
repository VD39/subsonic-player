/* istanbul ignore next -- @preserve */
export function useUser() {
  return useState<null | User>(STATE_NAMES.currentUser, () => null);
}
