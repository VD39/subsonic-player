import type { NuxtLinkProps } from 'nuxt/app';

export type Bitrate = (typeof BITRATE_OPTIONS)[number]['value'];

export type ButtonOrLinkType = 'button' | LinkIs;
export interface ButtonProps {
  icon?: Component | Icon;
  iconColor?: string;
  iconWeight?: IconWeight;
  text?: string;
}

export type FallbackIcon =
  TypeofImageDefaultByType[keyof TypeofImageDefaultByType];

export type Icon = TypeofIcons[keyof TypeofIcons];

export type IconSize = keyof typeof ICON_SIZE;

export type IconWeight = 'bold' | 'duotone' | 'fill' | 'regular';

export type Layout = (typeof LAYOUT_OPTIONS)[number]['value'];

export type LinkIs = 'a' | 'nuxt-link';

export type MediaTypeParam =
  TypeofRouteMediaTypeParams[keyof TypeofRouteMediaTypeParams];

export type PageNavigationMap = Record<string, ToProp>;

export type PlayableTrack = PodcastEpisode | RadioStation | Track;

export type QueueableMedia =
  | Album
  | PlayableTrack
  | Playlist
  | Podcast
  | PodcastEpisode;

export type RouteName = TypeofRouteNames[keyof TypeofRouteNames];

export type SnackType = 'error' | 'info' | 'success';

export type Theme = (typeof THEME_OPTIONS)[number]['value'];

export type ToProp = NuxtLinkProps['to'];

type TypeofIcons = typeof ICONS;

type TypeofImageDefaultByType = typeof FALLBACK_ICON_BY_TYPE;

type TypeofRouteMediaTypeParams = typeof ROUTE_MEDIA_TYPE_PARAMS;

type TypeofRouteNames = typeof ROUTE_NAMES;
