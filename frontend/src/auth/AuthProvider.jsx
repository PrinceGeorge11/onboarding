import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api("/auth/me").then(d => setUser(d.user)).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const d = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    setUser(d.user);
  };

  const logout = async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, ready, login, logout }}>{children}</AuthCtx.Provider>;
}
