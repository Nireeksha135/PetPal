import React, { createContext, useContext } from "react";

type User = {
  id: string;
  fullName?: string;
};

const AuthContext = createContext<{ user: User | null }>({ user: { id: "dev", fullName: "Dev User" } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Minimal mock auth for local development
  const user: User = { id: "1", fullName: "Developer" };
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
