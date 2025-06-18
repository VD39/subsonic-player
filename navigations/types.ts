export interface SidebarItem {
  icon: Icon;
  isDroppable?: boolean;
  title: string;
  to: ToProp;
}

export interface SidebarNavigation {
  items: SidebarItem[];
  title: string;
}
