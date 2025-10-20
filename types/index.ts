export type Icon = TypeofIcons[keyof TypeofIcons];

export type Image = Icon | string;

export type MediaTypeParam =
  TypeofRouteMediaTypeParams[keyof TypeofRouteMediaTypeParams];

export type RouteName = TypeofRouteNames[keyof TypeofRouteNames];

type TypeofIcons = typeof ICONS;

type TypeofRouteMediaTypeParams = typeof ROUTE_MEDIA_TYPE_PARAMS;

type TypeofRouteNames = typeof ROUTE_NAMES;
