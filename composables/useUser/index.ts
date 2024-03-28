export function useUser() {
  return useState<null | User>('user', () => null);
}
