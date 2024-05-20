import type { Raw } from 'vue';

export interface Navigation {
  title: string;
  icon: string;
  to: string;
  component?: Raw<unknown>;
  items: Navigation[];
}
