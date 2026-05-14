export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

export type ShowToastInput = {
  type: ToastType;
  message: string;
};

export type ToastContextValue = {
  showToast: (input: ShowToastInput) => void;
};