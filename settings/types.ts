type TypeofIcons = typeof ICONS;
export type Icon = TypeofIcons[keyof TypeofIcons];

export type Image = Icon | string;
