import type { Raw } from 'vue';

export interface ModalProps {
  attrs?: Record<string, unknown>;
  component: null | Raw<unknown>;
  title?: null | string;
}

export type ModalType = keyof typeof MODAL_TYPE;
