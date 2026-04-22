export type ServiceResult<T = void> = {
  success: boolean;
  status: number;
  message: string;
  data?: T;
};