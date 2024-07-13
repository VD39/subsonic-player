export interface PlayPauseButtonProps {
  icon: string;
  text: string;
}

export interface ShuffleButtonProps {
  iconColor: string;
  iconWeight: IconWeight;
  title?: string;
}

export interface RepeatButtonProps extends ShuffleButtonProps {
  icon: string;
}
