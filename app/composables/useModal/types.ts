import type { Raw } from 'vue';

export interface ModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attrs?: Record<string, any>;
  component: null | Raw<unknown>;
  title?: null | string;
}

export type ModalType = keyof typeof MODAL_TYPE;
