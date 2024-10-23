export interface Snack {
  auto?: boolean;
  content: string;
  id: string;
  // eslint-disable-next-line no-undef
  timer?: NodeJS.Timeout | null;
  type: SnackType;
}
