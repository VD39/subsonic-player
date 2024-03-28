import type { User } from './types';

export function useUser() {
  return useState<null | User>('user', () => null);
}
