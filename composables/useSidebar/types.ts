import type { IconName } from '@fortawesome/fontawesome-svg-core';

export interface Navigation {
  title: string;
  icon: IconName;
  to: string;
  items: Navigation[];
}
