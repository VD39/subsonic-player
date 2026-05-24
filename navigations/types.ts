export interface NavigationGroup {
  items: NavigationItem[];
  title: string;
}

export interface NavigationItem {
  icon: Icon;
  isDroppable?: boolean;
  title: string;
  to: ToProp;
}
