export type ToastType = "success" | "error" | "warning";

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}
