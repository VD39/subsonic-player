import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { vi } from 'vitest';

const useHeadTitleMock = ref('');

mockNuxtImport('useHead', () =>
  vi.fn((head) => {
    if (typeof head.title === 'function') {
      useHeadTitleMock.value = head.title();
    }

    if (typeof head.title === 'string') {
      useHeadTitleMock.value = head.title;
    }

    return head;
  }),
);

export function useHeadMock() {
  return {
    useHeadTitleMock,
  };
}
