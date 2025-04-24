export type Icon = TypeofIcons[keyof TypeofIcons];

export type Image = Icon | string;

export type RouteName = TypeofRouteNames[keyof TypeofRouteNames];

type TypeofIcons = typeof ICONS;

type TypeofRouteNames = typeof ROUTE_NAMES;
