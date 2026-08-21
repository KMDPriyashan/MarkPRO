export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type AuthUser = {
  uid: string;
  email: string;
  name?: string;
  role?: string;
};
