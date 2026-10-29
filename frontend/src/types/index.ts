export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  mob: string | null;
  age: number | null;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  mob?: string;
  age?: number | string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: User;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}

export interface ServerHealthResponse {
  status: string;
  message: string;
}
