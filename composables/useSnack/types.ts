export interface Snack {
  auto?: boolean;
  content: string;
  id: string;
  timer?: null | ReturnType<typeof setTimeout>;
  type: SnackType;
}
