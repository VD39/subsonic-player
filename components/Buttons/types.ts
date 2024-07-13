export type IconPosition = 'left' | 'right';

export type IconWeight = 'fill' | 'duotone' | 'regular' | 'bold';

export type ButtonType = 'button' | 'nuxt-link' | 'a' | 'div';

export interface FavouriteButtonProps {
  iconColor?: string;
  iconWeight: IconWeight;
  text: string;
}
