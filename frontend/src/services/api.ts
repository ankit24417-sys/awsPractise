import type {
  User,
  RegisterPayload,
  LoginPayload,
  AuthSuccessResponse,
  ServerHealthResponse,
} from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          data?.error || data?.details || data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data as T;
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error(`Unable to connect to backend server at ${API_BASE_URL}. Is the server running?`);
      }
      throw err;
    }
  }

  // Health check
  async checkHealth(): Promise<ServerHealthResponse> {
    return this.request<ServerHealthResponse>("/");
  }

  // User Registration
  async register(payload: RegisterPayload): Promise<AuthSuccessResponse> {
    return this.request<AuthSuccessResponse>("/register", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        mob: payload.mob?.trim() || null,
        age: payload.age !== undefined && payload.age !== "" ? Number(payload.age) : null,
      }),
    });
  }

  // User Login
  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
    return this.request<AuthSuccessResponse>("/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });
  }

  // Fetch single user by ID or Email
  async getUser(idOrEmail: number | string): Promise<User> {
    return this.request<User>(`/user/${idOrEmail}`);
  }

  // Fetch all registered users
  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>("/allUsers");
  }
}

export const api = new ApiService();
