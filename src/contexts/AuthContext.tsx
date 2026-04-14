import React, { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, setAuthData, clearAuthData, getSavedUser } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id?: number; email: string; name?: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id?: number; email: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(email, password);
      // Adapte conforme o retorno do seu backend:
      // Espera: { token, user: { id, email, name }, site_id }
      const token = response.token || response.access_token || "";
      const userData = response.user || { email };
      const siteId = response.site_id || 1;

      setAuthData(token, siteId, userData);
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
