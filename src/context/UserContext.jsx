// src/context/UserContext.jsx
import { createContext, useEffect, useState } from "react";
import api from "../lib/api";

export const UserContext = createContext({ user: null, setUser: () => {} });

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setBootstrapped(true); return; }

    (async () => {
      try {
        const res = await api.get("/user/me"); // must be implemented on backend
        setUser(res.data?.user ?? null);
      } catch {
        // only clear if truly invalid
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  if (!bootstrapped) return null; // or a splash screen

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
