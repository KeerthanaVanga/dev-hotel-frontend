import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextType } from "../types/AuthContextType";
import api from "../lib/axios-interceptor";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    setLoading(true);
    try {
      await api.get("/auth/me");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  const logoutUser = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, setLoading, refreshAuth, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
