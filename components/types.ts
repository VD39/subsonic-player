export type ButtonLink = 'button' | Link;

export interface ButtonProps {
  icon?: Component | Icon;
  iconColor?: string;
  iconWeight?: IconWeight;
  text?: string;
}

export type IconPosition = 'left' | 'right';

export type IconSize = keyof typeof ICON_SIZE;

export type IconWeight = 'bold' | 'duotone' | 'fill' | 'regular';

export type Link = 'a' | 'nuxt-link';

export interface PageNavigation {
  param?: keyof typeof ROUTE_TYPES;
  routes: Record<string, string | undefined>;
}

export type SnackType = 'error' | 'info' | 'success';
