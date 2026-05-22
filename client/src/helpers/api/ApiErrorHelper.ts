import axios, { type AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string | null;
};

export type ApiClientError = AxiosError<ApiErrorPayload> | Error | null;

export function getApiErrorMessage(
  error: ApiClientError,
  fallback: string,
): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}