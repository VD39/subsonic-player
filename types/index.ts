import type { NuxtLinkProps } from '#app';

export type ButtonLink = 'button' | Link;

export interface ButtonProps {
  icon?: Component | Icon;
  iconColor?: string;
  iconWeight?: IconWeight;
  text?: string;
}

export type Icon = TypeofIcons[keyof TypeofIcons];

export type IconSize = keyof typeof ICON_SIZE;

export type IconWeight = 'bold' | 'duotone' | 'fill' | 'regular';

export type ImageDefault =
  TypeofImageDefaultByType[keyof TypeofImageDefaultByType];

export type Link = 'a' | 'nuxt-link';

export type MediaTypeParam =
  TypeofRouteMediaTypeParams[keyof TypeofRouteMediaTypeParams];

export type PageNavigation = Record<string, ToProp>;

export type RouteName = TypeofRouteNames[keyof TypeofRouteNames];

export type SnackType = 'error' | 'info' | 'success';

export type ToProp = NuxtLinkProps['to'];

type TypeofIcons = typeof ICONS;

type TypeofImageDefaultByType = typeof IMAGE_DEFAULT_BY_TYPE;

type TypeofRouteMediaTypeParams = typeof ROUTE_MEDIA_TYPE_PARAMS;

type TypeofRouteNames = typeof ROUTE_NAMES;
