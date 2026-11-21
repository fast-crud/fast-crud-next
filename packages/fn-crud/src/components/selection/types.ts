export type FnOptionValue = string | number | boolean;

export interface FnSelectOption {
  value: FnOptionValue;
  label: string;
  show?: boolean;
  disabled?: boolean;
}
