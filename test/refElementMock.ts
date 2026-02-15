import { vi } from 'vitest';

export function refElementMock() {
  const containsMock = vi.fn().mockReturnValue(false);

  const getBoundingClientRectMock = vi.fn().mockReturnValue({
    bottom: 50,
    height: 10,
    left: 35,
    right: 189,
    top: 100,
    width: 54,
  } as unknown as DOMRect);

  const refMock = ref({
    contains: containsMock,
    getBoundingClientRect: getBoundingClientRectMock,
  }) as unknown as Ref<HTMLElement | null>;

  return {
    containsMock,
    getBoundingClientRectMock,
    refMock,
  };
}
