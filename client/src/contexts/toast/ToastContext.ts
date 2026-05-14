import { createContext } from "react";
import type { ToastContextValue } from "./ToastTypes";
export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);