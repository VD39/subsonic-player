export type SnackType = 'error' | 'info' | 'success';

export type IconSize = keyof typeof ICON_SIZE;

export type IconPosition = 'left' | 'right';

export type IconWeight = 'bold' | 'duotone' | 'fill' | 'regular';

export type Link = 'a' | 'nuxt-link';

export type ButtonLink = 'button' | Link;

export interface ButtonProps {
  icon?: Component | Icon;
  iconColor?: string;
  iconWeight?: IconWeight;
  text?: string;
}

export interface PageNavigation {
  param?: keyof typeof ROUTE_TYPES;
  routes: Record<string, string | undefined>;
}
