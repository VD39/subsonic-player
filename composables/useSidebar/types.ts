import type { IconName } from '@fortawesome/fontawesome-svg-core';

export interface Navigation {
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  name: string;
  title: string;
  to: string;
  icon: IconName;
}
