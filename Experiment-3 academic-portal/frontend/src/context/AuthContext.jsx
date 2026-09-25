import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("amp_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("amp_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .getMe()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("amp_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("amp_token");
        localStorage.removeItem("amp_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const { token, user } = await authApi.login(username, password);
    localStorage.setItem("amp_token", token);
    localStorage.setItem("amp_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("amp_token");
    localStorage.removeItem("amp_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
