export type Icon = TypeofIcons[keyof TypeofIcons];
export type Image = Icon | string;

type TypeofIcons = typeof ICONS;
