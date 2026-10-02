import { createContext, useContext, useState } from "react";
import API from "../services/api";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const persist = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const login = async (f) =>
    persist((await API.post("/api/auth/login", f)).data);
  const register = async (f) =>
    persist((await API.post("/api/auth/register", f)).data);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  const updateProfile = async (name) => {
    const { data } = await API.put("/api/users/profile", { name });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };
  return (
    <Ctx.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}
