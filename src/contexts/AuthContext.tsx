import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, setAuthData, clearAuthData, getSavedUser, getToken } from '../lib/api';

interface AuthContextType {
  user: any;
  token: string | null;
  siteId: number | null;
  login: (email: string, senha: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getSavedUser();
    const savedToken = getToken();
    const savedSiteId = localStorage.getItem('@Sisgen:siteId');

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
      setSiteId(savedSiteId && savedSiteId !== 'null' ? parseInt(savedSiteId) : null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    const data = await apiLogin(email, senha);
    
    setUser(data.user);
    setToken(data.token);
    setSiteId(data.siteId);
    setAuthData(data.token, data.user, data.siteId);
    
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSiteId(null);
    clearAuthData();
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, siteId, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
