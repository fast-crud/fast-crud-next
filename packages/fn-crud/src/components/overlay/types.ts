import type { Ref, VNodeChild } from "vue";
import type { FnButtonProps } from "../button/types";
import type { FnFormContext } from "../form/types";
import type { FnSlots } from "../render/types";

export interface FnModalService {
  openDialog<Result = unknown>(Props: FnDialogProps<any>): Promise<Result | undefined>;
}

export interface FnModalProps {
  open?: boolean;
  title?: string;
  width?: number | string;
  draggable?: boolean;
  confirmLoading?: boolean;
  buttons?: Partial<Record<string, FnButtonProps<void>>>;
  footer?: boolean | null;
  slots?: FnSlots;
}

export interface FnModalInstance {
  fullscreen: Ref<boolean>;
  open: () => void;
  close: () => void;
  setFullscreen: (value: boolean) => void;
  toggleFullscreen: () => void;
}

export interface FnDialogProps<Form = Record<string, any>> {
  title: string;
  body?: () => VNodeChild;
  width?: number | string;
  draggable?: boolean;
  buttons?: Partial<Record<"reset" | "cancel" | "confirm", FnButtonProps<FnFormContext<Form>>>>;
  footer?: boolean | null;
  onOpen?: (ctx: FnDialogContext) => void;
  onClose?: (ctx: FnDialogContext) => void;
  onOpened?: (ctx: FnDialogContext) => void;
  slots?: FnSlots;
}

export interface FnDialogContext {
  close: () => void;
  open: () => void;
  fullscreen: Ref<boolean>;
}

export interface FnDialogRecord {
  id: number;
  open: boolean;
  loading: boolean;
  Props: FnDialogProps<any>;
  resolve: (value: any) => void;
  result?: any;
}
