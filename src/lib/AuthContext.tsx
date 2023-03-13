import { createContext, useContext, useEffect, useState } from "react";
import { getSavedUser } from "./storage";

interface AuthContextType {
  user: string;
  setUser: (user: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: async (user) => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // hydrate on mount
    const user = getSavedUser();
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
