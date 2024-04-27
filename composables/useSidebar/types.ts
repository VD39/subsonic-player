import type { Raw } from 'vue';
import type { IconName } from '@fortawesome/fontawesome-svg-core';

export interface Navigation {
  title: string;
  icon: IconName;
  to: string;
  component?: Raw<unknown>;
  items: Navigation[];
}
