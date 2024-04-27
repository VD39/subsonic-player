export interface Snack {
  id: string;
  content: string;
  type: SnackType;
  auto?: boolean;
  // eslint-disable-next-line no-undef
  timer?: NodeJS.Timeout | null;
}
