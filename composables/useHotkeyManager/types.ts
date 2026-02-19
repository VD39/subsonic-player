export type HotkeyMapping = Record<string, Mapping[]>;

export interface Mapping {
  action: (event: KeyboardEvent) => void;
  description: string;
  helpText: string;
  keys: string[];
}
