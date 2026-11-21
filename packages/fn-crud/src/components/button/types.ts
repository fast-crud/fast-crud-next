import type { Component } from "vue";
import type { FnRefable } from "../../types/index";

export interface FnButtonItem<Context = void> {
  key: string;
  label: string;
  show?: boolean;
  disabled?: boolean;
  danger?: boolean;
  icon?: Component;
  click?: (context: Context) => void;
}

export interface FnButtonBaseProps {
  text?: FnRefable<string>;
  type?: string;
  icon?: Component;
  shape?: "default" | "circle" | "round";
  tooltip?: string | { title: string };
  primaryColor?: string;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export interface FnButtonProps<Context = void> extends FnButtonBaseProps {
  show?: boolean;
  order?: number;
  buttonType?: "button" | "dropdown";
  click?: (context: Context) => void;
  items?: FnButtonItem<Context>[];
}

export interface FnDropdownButtonProps<Context = void> extends FnButtonBaseProps {
  items: FnButtonItem<Context>[];
}
