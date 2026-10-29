import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, LoginPayload, RegisterPayload } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  serverStatus: "checking" | "online" | "offline";
  serverMessage: string;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  refreshCurrentUser: () => Promise<void>;
  checkServer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "authflow_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [serverMessage, setServerMessage] = useState<string>("Connecting to backend...");

  // Health check callback
  const checkServer = useCallback(async () => {
    try {
      const res = await api.checkHealth();
      setServerStatus("online");
      setServerMessage(res.message || "Backend connected");
    } catch (err: any) {
      setServerStatus("offline");
      setServerMessage(err.message || "Backend offline");
    }
  }, []);

  // Check backend connection on mount & poll periodically
  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => clearInterval(interval);
  }, [checkServer]);

  // If user is stored in localStorage, refresh their data from backend to stay in sync
  useEffect(() => {
    if (user?.id) {
      api.getUser(user.id)
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(freshUser));
        })
        .catch(() => {
          // If user not found or server offline, preserve cached user
        });
    }
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await api.login(payload);
      setUser(response.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(response.user));
      setServerStatus("online");
      return { success: true, message: response.message || "Logged in successfully" };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await api.register(payload);
      setUser(response.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(response.user));
      setServerStatus("online");
      return { success: true, message: response.message || "Account created successfully" };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const refreshCurrentUser = async () => {
    if (!user?.id) return;
    try {
      const freshUser = await api.getUser(user.id);
      setUser(freshUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(freshUser));
    } catch (err: any) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        serverStatus,
        serverMessage,
        login,
        register,
        logout,
        refreshCurrentUser,
        checkServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
